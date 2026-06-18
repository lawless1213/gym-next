import { db } from "@/app/lib/firebaseConfig";
import { RoutinesExercise, WorkoutSession } from "@/app/types";
import { collection, addDoc, serverTimestamp, doc, writeBatch, DocumentReference, getDoc} from "firebase/firestore";
import { writeExerciseRecord } from "./record";

export async function writeWorkoutSession(
  userId: string,
  data: WorkoutSession,
) {
	data.exercises.forEach(exercise => {
		console.log(exercise);
		
	})
	// writeExerciseRecord(userId, )
	
  const historyRef = collection(db, "users", userId, "workoutHistory");

	// await addDoc(historyRef, data);
}