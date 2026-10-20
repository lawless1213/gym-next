import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/config/firebaseConfig";
import type { WorkoutSession } from "@/types";
import { writeWorkoutRecords } from "./record";

/**
 * Saves a finished workout to `workoutHistory` and updates personal records.
 *
 * Returns as soon as the history write is queued locally — it does not wait for the network.
 * Firestore's persistent cache keeps the pending write across reloads and sends it when the
 * device is back online; `synced` resolves once the server has acknowledged everything.
 *
 * The document id is the workout id, so writing the same workout again (re-send after a
 * failure, or a restored pending copy) overwrites it instead of creating a duplicate.
 */
export function writeWorkoutSession(userId: string, workout: WorkoutSession): { synced: Promise<void> } {
  const historySynced = setDoc(doc(db, "users", userId, "workoutHistory", workout.id), workout);
  // Records are written separately so a failed read can never block the history write.
  const recordsSynced = writeWorkoutRecords(userId, workout);
  return { synced: Promise.all([historySynced, recordsSynced]).then(() => undefined) };
}
