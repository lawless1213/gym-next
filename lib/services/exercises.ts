import { db } from "@/lib/config/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Exercise } from "@/types";

export async function getCommonExercises(): Promise<Exercise[]> {
  try {
    const exercisesRef = collection(db, "exercises");
    // Створюємо запит із сортуванням за полем "name"
    const q = query(exercisesRef, orderBy("name"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        ...data,
        isCustom: false,
        id: doc.id,
      } as Exercise;
    });
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function getUserExercises(userId: string): Promise<Exercise[]> {
  if (!userId) return [];

  try {
    const exercisesRef = collection(db, "users", userId, "exercises");
    // Створюємо запит із сортуванням за полем "name"
    const q = query(exercisesRef, orderBy("name"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        ...data,
        isCustom: true,
        id: doc.id,
      } as Exercise;
    });
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}