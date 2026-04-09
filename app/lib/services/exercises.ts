import { db } from "@/app/lib/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Exercise } from "@/app/types";

export async function getUserExercises(userId: string): Promise<Exercise[]> {
  if (!userId) return [];

  try {
    const exercisesRef = collection(db, "users", userId, "exercises");
    const querySnapshot = await getDocs(exercisesRef);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        ...data,
        id: doc.id,
      } as Exercise;
    });
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
