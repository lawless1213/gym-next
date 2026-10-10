"use server";

import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminBucket, adminDb } from "@/lib/firebase/firebase-admin";
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

export type DeleteUserDataResult = { ok: true } | { ok: false; error: "INVALID_SESSION" | "REAUTH_REQUIRED" };

/** Max age of the last sign-in for destructive actions (mirrors Firebase's "recent login"). */
const RECENT_LOGIN_SECONDS = 5 * 60;

/**
 * Deletes all Firestore data (users/{uid} with every subcollection) and Storage files of the user.
 * The client then deletes the Auth user itself. Requires a recent sign-in.
 */
export async function deleteUserData(idToken: string): Promise<DeleteUserDataResult> {
  let uid: string;
  let authTime: number;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken, true);
    uid = decoded.uid;
    authTime = decoded.auth_time;
  } catch {
    return { ok: false, error: "INVALID_SESSION" };
  }

  if (Date.now() / 1000 - authTime > RECENT_LOGIN_SECONDS) {
    return { ok: false, error: "REAUTH_REQUIRED" };
  }

  await adminDb.recursiveDelete(adminDb.collection("users").doc(uid));

  try {
    await adminBucket().deleteFiles({ prefix: `users/${uid}/` });
  } catch (error) {
    console.error("deleteUserData: failed to delete Storage files", error);
  }

  return { ok: true };
}
