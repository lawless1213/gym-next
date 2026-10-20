import "server-only";
import { adminAuth, adminDb } from "@/lib/firebase/firebase-admin";
import { isSubscriptionActive, parseSubscription } from "@/lib/subscription";
import { FieldValue } from "firebase-admin/firestore";
import { reportError } from "@/lib/monitoring";

/** Max AI requests per UTC day for premium users (protects the Gemini bill). */
export const PREMIUM_DAILY_AI_LIMIT = 50;

/** `users/{uid}.aiUsage` — server-only (see firestore.rules). */
type AiUsage = { day: string; count: number };

type Reservation = { userId: string; kind: "free" } | { userId: string; kind: "premium"; day: string };

type ReserveResult =
  { ok: true; reservation: Reservation; freeAiTries: number } | { ok: false; error: string; freeAiTries: number };

const utcDay = (date = new Date()) => date.toISOString().slice(0, 10);

class GuardError extends Error {
  constructor(
    public code: "NO_FREE_TRIES" | "AI_DAILY_LIMIT",
    public freeAiTries: number,
  ) {
    super(code);
  }
}

/**
 * Atomically reserves one AI request: decrements free tries for free users,
 * increments the daily counter for premium users. Undo with `refundAiTry`.
 */
async function reserveAiTry(idToken: string): Promise<ReserveResult> {
  let userId: string;
  try {
    userId = (await adminAuth.verifyIdToken(idToken)).uid;
  } catch {
    return { ok: false, error: "Сесія недійсна. Увійдіть ще раз.", freeAiTries: 0 };
  }

  const userRef = adminDb.collection("users").doc(userId);

  try {
    return await adminDb.runTransaction(async (tx): Promise<ReserveResult> => {
      const snap = await tx.get(userRef);
      const subscribed = parseSubscription(snap.data()?.subscribed);

      if (isSubscriptionActive(subscribed)) {
        const day = utcDay();
        const usage = snap.data()?.aiUsage as AiUsage | undefined;
        const count = usage?.day === day ? usage.count : 0;
        if (count >= PREMIUM_DAILY_AI_LIMIT) throw new GuardError("AI_DAILY_LIMIT", subscribed.freeAiTries);

        tx.update(userRef, { aiUsage: { day, count: count + 1 } });
        return { ok: true, reservation: { userId, kind: "premium", day }, freeAiTries: subscribed.freeAiTries };
      }

      if (subscribed.freeAiTries <= 0) throw new GuardError("NO_FREE_TRIES", 0);

      tx.update(userRef, { "subscribed.freeAiTries": FieldValue.increment(-1) });
      return { ok: true, reservation: { userId, kind: "free" }, freeAiTries: subscribed.freeAiTries - 1 };
    });
  } catch (err) {
    if (err instanceof GuardError) {
      const error =
        err.code === "NO_FREE_TRIES"
          ? "Безкоштовні спроби вичерпано. Оформіть підписку, щоб продовжити."
          : "Денний ліміт AI-запитів вичерпано. Спробуйте завтра.";
      return { ok: false, error, freeAiTries: err.freeAiTries };
    }
    throw err;
  }
}

/** Gives back a reserved try when the AI call failed. Never throws. */
async function refundAiTry(reservation: Reservation): Promise<void> {
  const userRef = adminDb.collection("users").doc(reservation.userId);
  try {
    if (reservation.kind === "free") {
      await userRef.update({ "subscribed.freeAiTries": FieldValue.increment(1) });
      return;
    }
    await adminDb.runTransaction(async (tx) => {
      const usage = (await tx.get(userRef)).data()?.aiUsage as AiUsage | undefined;
      if (usage?.day === reservation.day && usage.count > 0) {
        tx.update(userRef, { aiUsage: { day: usage.day, count: usage.count - 1 } });
      }
    });
  } catch (error) {
    reportError(error, "refundAiTry failed", { kind: reservation.kind });
  }
}

type Failure = { success: false; error: string };

/**
 * Runs an AI action under the try/limit policy:
 * reserve → run → refund if the run failed or threw. Always returns current `freeAiTries`.
 * Validate input BEFORE calling this so invalid requests are never charged.
 */
export async function withAiTry<T extends { success: true } | Failure>(
  idToken: string,
  run: (userId: string) => Promise<T>,
): Promise<(T | Failure) & { freeAiTries: number }> {
  const reserved = await reserveAiTry(idToken);
  if (!reserved.ok) return { success: false, error: reserved.error, freeAiTries: reserved.freeAiTries };

  const { reservation } = reserved;
  const refundedTries = reservation.kind === "free" ? reserved.freeAiTries + 1 : reserved.freeAiTries;

  try {
    const result = await run(reservation.userId);
    if (!result.success) {
      await refundAiTry(reservation);
      return { ...result, freeAiTries: refundedTries };
    }
    return { ...result, freeAiTries: reserved.freeAiTries };
  } catch (error) {
    reportError(error, "AI action failed");
    await refundAiTry(reservation);
    return { success: false, error: "Не вдалося обробити запит до AI", freeAiTries: refundedTries };
  }
}
