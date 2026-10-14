import "server-only";
import { adminDb } from "@/lib/firebase/firebase-admin";
import type { Exercise } from "@/types";
import { toPlain } from "./serialize";

/** Server-side (Admin SDK) counterpart of lib/services/exercises.ts. */
export async function getCommonExercises(): Promise<Exercise[]> {
  try {
    const snap = await adminDb.collection("exercises").orderBy("name").get();
    return snap.docs.map((d) => ({ ...toPlain<object>(d.data()), isCustom: false, id: d.id }) as Exercise);
  } catch (error) {
    console.error("getCommonExercises (admin) failed:", error);
    return [];
  }
}

export async function getUserExercises(userId: string): Promise<Exercise[]> {
  if (!userId) return [];
  try {
    const snap = await adminDb.collection("users").doc(userId).collection("exercises").orderBy("name").get();
    return snap.docs.map((d) => ({ ...toPlain<object>(d.data()), isCustom: true, id: d.id }) as Exercise);
  } catch (error) {
    console.error("getUserExercises (admin) failed:", error);
    return [];
  }
}

export async function getAllExercises(userId: string): Promise<Exercise[]> {
  const [common, user] = await Promise.all([getCommonExercises(), getUserExercises(userId)]);
  return [...common, ...user];
}
