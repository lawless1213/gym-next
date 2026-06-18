import { db } from "@/app/lib/firebaseConfig";
import { WorkoutExercise } from "@/app/types";
import { collection, addDoc, serverTimestamp, doc, writeBatch, DocumentReference, getDoc} from "firebase/firestore";

export async function writeExerciseRecord(
  userId: string,
  data: WorkoutExercise,
) {
	console.log(data);
	
  // const historyRef = collection(db, "users", userId, "workoutHistory");
	
	// await addDoc(historyRef, data);
}