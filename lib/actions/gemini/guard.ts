import { adminAuth, adminDb } from "@/lib/firebase/firebase-admin"; // ← підправ шлях під свій
import { FieldValue } from "firebase-admin/firestore";

export type GuardResult =
  | { ok: true; userId: string; freeAiTries: number; isPremium: boolean }
  | { ok: false; error: string; freeAiTries: number };

export async function requireFreeTry(idToken: string): Promise<GuardResult> {
  let userId: string;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    userId = decoded.uid;
  } catch {
    return { ok: false, error: "Сесія недійсна. Увійдіть ще раз.", freeAiTries: 0 };
  }

  const userRef = adminDb.collection("users").doc(userId);
  let remainingTries = 0;
  let isPremium = false;

  try {
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      const subscribed = snap.data()?.subscribed ?? {};

      if (subscribed.type) {
        isPremium = true;
        remainingTries = subscribed.freeAiTries ?? 0;
        return;
      }

      const tries = subscribed.freeAiTries ?? 0;
      if (tries <= 0) {
        remainingTries = 0;
        throw new Error("NO_FREE_TRIES");
      }

      remainingTries = tries - 1;
      tx.update(userRef, {
        "subscribed.freeAiTries": FieldValue.increment(-1),
      });
    });
  } catch (err) {
    if (err instanceof Error && err.message === "NO_FREE_TRIES") {
      return {
        ok: false,
        error: "Безкоштовні спроби вичерпано. Оформіть підписку, щоб продовжити.",
        freeAiTries: 0,
      };
    }
    throw err;
  }

  return { ok: true, userId, freeAiTries: remainingTries, isPremium };
}