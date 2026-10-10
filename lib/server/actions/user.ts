"use server";

import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/firebase-admin";
import { DEFAULT_SUBSCRIPTION } from "@/lib/subscription";

export type InitUserDocResult = { ok: true; created: boolean } | { ok: false; error: "INVALID_SESSION" };

/**
 * Creates `users/{uid}` on the server after sign-in. Idempotent: safe to call on every login.
 * The client never writes `subscribed` — it is initialised here with the Admin SDK.
 */
export async function initUserDoc(idToken: string): Promise<InitUserDocResult> {
  let uid: string;
  let name: string | undefined;
  let picture: string | undefined;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    uid = decoded.uid;
    name = typeof decoded.name === "string" ? decoded.name : undefined;
    picture = decoded.picture;
  } catch {
    return { ok: false, error: "INVALID_SESSION" };
  }

  const userRef = adminDb.collection("users").doc(uid);

  const created = await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);

    if (!snap.exists) {
      tx.set(userRef, {
        displayName: name ?? "",
        avatarUrl: picture ?? "",
        createdAt: FieldValue.serverTimestamp(),
        subscribed: DEFAULT_SUBSCRIPTION,
      });
      return true;
    }

    // Doc exists (e.g. created by an older client) but has no subscription — initialise it.
    if (snap.get("subscribed") == null) {
      tx.update(userRef, { subscribed: DEFAULT_SUBSCRIPTION });
    }
    return false;
  });

  return { ok: true, created };
}
