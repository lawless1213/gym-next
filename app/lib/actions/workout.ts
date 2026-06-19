import { db } from "@/app/lib/firebaseConfig";
import { PersonalRecord, RoutinesExercise, WorkoutSession } from "@/app/types";
import { collection, addDoc, serverTimestamp, doc, writeBatch, DocumentReference, getDoc} from "firebase/firestore";
import { writeExerciseRecord } from "./record";

export async function writeWorkoutSession(
  userId: string,
  data: WorkoutSession,
) {
  for (const exercise of data.exercises) {
    const maxWeightSet = exercise.sets.reduce((max, current) =>
      max.weight > current.weight ? max : current
    );

    const record: PersonalRecord = {
      date: data.startedAt,
      exerciseName: exercise.name,
      reps: maxWeightSet.reps,
      weight: maxWeightSet.weight,
      exerciseId: exercise.id,
    };

    await writeExerciseRecord(userId, record);
  }

  const historyRef = collection(db, "users", userId, "workoutHistory");
  await addDoc(historyRef, data);
}