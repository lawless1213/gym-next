import { db } from "@/app/lib/firebaseConfig";
import { RoutinesExercise } from "@/app/types";
import { collection, addDoc, serverTimestamp, doc, writeBatch, DocumentReference, getDoc} from "firebase/firestore";

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

export async function deleteUserRoutine(userId: string, routineId: string) {
  const routineRef = doc(db, "users", userId, "routines", routineId);
  const userRef = doc(db, "users", userId);

  const userSnap = await getDoc(userRef);
  const schedule = userSnap.data()?.schedule ?? {};

  const batch = writeBatch(db);

  const updatedSchedule = { ...schedule };
  for (const day of Object.keys(updatedSchedule)) {
    const dayRefs = updatedSchedule[day] ?? [];
    updatedSchedule[day] = dayRefs.filter(
      (r: DocumentReference) => r.path !== routineRef.path
    );
  }

  batch.update(userRef, { schedule: updatedSchedule });
  batch.delete(routineRef);

  await batch.commit();
}