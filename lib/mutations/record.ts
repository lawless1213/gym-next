import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/config/firebaseConfig";
import type { RecordsMap, WorkoutSession } from "@/types";
import { bestSetsByExercise, isNewPersonalRecord } from "@/lib/domain/records";

/**
 * Updates personal records from a finished workout (one merged write to `stats/records`).
 *
 * Needs the current records to compare against: `getDoc` returns them from the server, or from the
 * persistent cache when offline. If they are not cached either, records are skipped rather than
 * overwritten with possibly lower values. Resolves when the write is acknowledged by the server.
 */
export async function writeWorkoutRecords(userId: string, workout: WorkoutSession): Promise<void> {
  const candidates = bestSetsByExercise<WorkoutSession["exercises"][number]>(workout.exercises);
  if (candidates.length === 0) return;

  const recordRef = doc(db, "users", userId, "stats", "records");
  let existing: Partial<RecordsMap>;
  try {
    const snap = await getDoc(recordRef);
    existing = (snap.data() as RecordsMap | undefined) ?? {};
  } catch {
    // Offline and never loaded: unknown current records, skip instead of guessing.
    return;
  }

  const updates: Record<string, object> = {};
  for (const { exercise, best } of candidates) {
    const current = existing[exercise.id];
    if (!isNewPersonalRecord(best, current)) continue;
    updates[exercise.id] = {
      date: serverTimestamp(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      reps: best.reps,
      weight: best.weight,
      ...(current && { prevReps: current.reps, prevWeight: current.weight }),
    };
  }

  if (Object.keys(updates).length > 0) {
    await setDoc(recordRef, updates, { merge: true });
  }
}
