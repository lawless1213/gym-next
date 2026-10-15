import "server-only";
import { DocumentReference } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/firebase-admin";
import type { Exercise, Routine } from "@/types";
import { toPlain } from "./serialize";
import { reportError } from "@/lib/monitoring";

type RoutineDoc = {
  name?: string;
  color?: string;
  exercises?: unknown[];
};

/**
 * Admin SDK bypasses security rules, so a stored reference must never let us read
 * another user's data. Only the public catalog and the owner's own exercises are allowed.
 */
function toAllowedExercisePath(item: unknown, userId: string): string | null {
  const path = item instanceof DocumentReference ? item.path : typeof item === "string" ? item : null;
  if (!path) return null;

  const segments = path.split("/").filter(Boolean);
  const isCatalog = segments.length === 2 && segments[0] === "exercises";
  const isOwn =
    segments.length === 4 && segments[0] === "users" && segments[1] === userId && segments[2] === "exercises";
  return isCatalog || isOwn ? segments.join("/") : null;
}

/** Server-side (Admin SDK) counterpart of lib/services/routines.ts. */
export async function getUserRoutines(userId: string): Promise<Routine[]> {
  if (!userId) return [];

  try {
    const snap = await adminDb.collection("users").doc(userId).collection("routines").get();

    return await Promise.all(
      snap.docs.map(async (routineSnap) => {
        const data = routineSnap.data() as RoutineDoc;
        const paths = (Array.isArray(data.exercises) ? data.exercises : [])
          .map((item) => toAllowedExercisePath(item, userId))
          .filter((p): p is string => p !== null);

        const exerciseSnaps = paths.length > 0 ? await adminDb.getAll(...paths.map((p) => adminDb.doc(p))) : [];
        const exercises: Exercise[] = exerciseSnaps
          .filter((s) => s.exists)
          .map(
            (s) =>
              ({
                ...toPlain<object>(s.data()),
                id: s.id,
                isCustom: s.ref.path.startsWith("users/"),
              }) as Exercise,
          );

        return {
          id: routineSnap.id,
          name: data.name ?? "",
          color: data.color ?? "#2563EB",
          exercises,
        } satisfies Routine;
      }),
    );
  } catch (error) {
    reportError(error, "getUserRoutines (admin) failed:");
    return [];
  }
}
