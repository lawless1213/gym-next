import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/config/firebaseConfig";
import { PersonalRecord } from "@/types";
import { isNewPersonalRecord } from "@/lib/domain/records";

export async function writeExerciseRecord(userId: string, data: PersonalRecord) {
  const recordRef = doc(db, "users", userId, "stats", "records");
  const existingDoc = await getDoc(recordRef);
  const allRecords = existingDoc.exists() ? existingDoc.data() : {};
  const existing = allRecords[data.exerciseId] || null;

  const shouldUpdate = isNewPersonalRecord(data, existing);

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
      { merge: true },
    );
  }
}
