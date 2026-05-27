import { db } from "@/app/lib/firebaseConfig";
import { RoutinesExercise } from "@/app/types";
import { collection, addDoc, serverTimestamp, doc} from "firebase/firestore";

export async function createUserRoutine(
  userId: string,
  data: {
    title: string;
    color: string;
    exercises: RoutinesExercise[];
  }
) {
  const routinesRef = collection(db, "users", userId, "routines");

	const exerciseRefs = data.exercises.map((exercise) =>
    exercise.isCustom
      ? doc(db, "users", userId, "exercises", exercise.exerciseId)
      : doc(db, "exercises", exercise.exerciseId)
  );

  const docRef = await addDoc(routinesRef, {
    name: data.title,
    color: data.color,
		exercises: exerciseRefs,
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id };
}