import { db } from "@/app/lib/firebaseConfig";
import { collection, getDocs, getDoc, doc, DocumentReference, DocumentData } from "firebase/firestore";
import { Exercise, Routine } from "@/app/types";

type RoutineDoc = {
  name?: string;
  color?: string;
  exercises?: DocumentReference<DocumentData>[];
};

export async function getUserRoutines(userId: string): Promise<Routine[]> {
  if (!userId) return [];
  try {
    const routinesRef = collection(db, "users", userId, "routines");
    const routinesSnap = await getDocs(routinesRef);

    const routines = await Promise.all(
      routinesSnap.docs.map(async (routineDoc) => {
        const data = routineDoc.data() as RoutineDoc;

        const rawExercises = Array.isArray(data.exercises) ? data.exercises : [];
        const refs: DocumentReference<DocumentData>[] = rawExercises
          .map((item) => {
            if (item && typeof item === "object" && "id" in item && "path" in item) {
              return item as DocumentReference<DocumentData>;
            }
						
            if (typeof item === "string" && item.trim()) {
              return doc(db, item) as DocumentReference<DocumentData>;
            }

            return null;
          })
          .filter((ref): ref is DocumentReference<DocumentData> => ref !== null);
        const exerciseSnaps = await Promise.all(refs.map((ref) => getDoc(ref)));

        const exercises: Exercise[] = exerciseSnaps
          .filter((snap) => snap.exists())
          .map((snap) => {
            const ex = snap.data() as Omit<Exercise, "id">;
            return { id: snap.id, ...ex };
          });

        return {
          id: routineDoc.id,
          name: data.name ?? "",
          color: data.color ?? "#2563EB",
          exercises,
        } satisfies Routine;
      }),
    );
    return routines;
  } catch (error) {
    console.error("Error loading routines:", error);
    return [];
  }
}
