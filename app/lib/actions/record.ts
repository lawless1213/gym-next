import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { PersonalRecord } from "@/app/types";

export async function writeExerciseRecord(userId: string, data: PersonalRecord) {
  const recordRef = doc(db, "users", userId, "stats", "records");
  const existingDoc = await getDoc(recordRef);
  const allRecords = existingDoc.exists() ? existingDoc.data() : {};
  const existing = allRecords[data.exerciseId] || null;

  let shouldUpdate = false;

  if (!existing) {
    shouldUpdate = true;
  } else {
    const weightIsGreater = data.weight > existing.weight;
    const repsAreGreaterWithSameWeight = data.weight === existing.weight && data.reps > existing.reps;

    if (weightIsGreater || repsAreGreaterWithSameWeight) {
      shouldUpdate = true;
    }
  }

  if (shouldUpdate) {
    await setDoc(
      recordRef,
      {
        [data.exerciseId]: {
          date: serverTimestamp(),
          exerciseId: data.exerciseId,
          exerciseName: data.exerciseName,
          reps: data.reps,
          weight: data.weight,
          ...(existing && {
            prevReps: existing.reps,
            prevWeight: existing.weight,
          }),
        },
      },
      { merge: true }
    );
    console.log("New personal record saved!");
  } else {
    console.log("New data is not a personal record. Skip saving.");
  }
}