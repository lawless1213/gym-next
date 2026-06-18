import { db } from "@/app/lib/firebaseConfig";
import { RoutinesExercise, WorkoutSession } from "@/app/types";
import { collection, addDoc, serverTimestamp, doc, writeBatch, DocumentReference, getDoc} from "firebase/firestore";

export async function writeWorkoutSwssion(
  userId: string,
  data: WorkoutSession,
) {
  const historyRef = collection(db, "users", userId, "workoutHistory");
	
	await addDoc(historyRef, data);
}