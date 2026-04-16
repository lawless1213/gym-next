import { db } from "@/app/lib/firebaseConfig";
import { getDoc, doc, DocumentReference, DocumentData } from "firebase/firestore";
import { Exercise, Routine } from "@/app/types";

type RoutineDoc = {
  name?: string;
  color?: string;
  exercises?: Array<DocumentReference<DocumentData> | string>;
};

/**
 * Converts a Firestore reference or a string path into a DocumentReference.
 * Returns null if the input is invalid.
 */
export function toDocRef(
  item: DocumentReference<DocumentData> | string | unknown
): DocumentReference<DocumentData> | null {
  if (item && typeof item === "object" && "id" in item && "path" in item) {
    return item as DocumentReference<DocumentData>;
  }

  if (typeof item === "string") {
    const segments = item.split("/").filter(Boolean);
    if (segments.length >= 2 && segments.length % 2 === 0) {
      return doc(db, item);
    }
    console.warn(`[toDocRef] Invalid path: "${item}"`);
  }

  return null;
}

/**
 * Resolves a routine snapshot into a full Routine object with exercises.
 */
export async function resolveRoutine(
  snap: Awaited<ReturnType<typeof getDoc>>
): Promise<Routine | null> {
  if (!snap.exists()) return null;

  const routineData = snap.data() as RoutineDoc;

  const rawExercises = Array.isArray(routineData.exercises) ? routineData.exercises : [];
  const exerciseRefs = rawExercises.map(toDocRef).filter((ref): ref is DocumentReference<DocumentData> => ref !== null);

  const exerciseSnaps = await Promise.all(exerciseRefs.map((ref) => getDoc(ref)));
  const exercises: Exercise[] = exerciseSnaps
    .filter((s) => s.exists())
    .map((s) => ({
      id: s.id,
      ...(s.data() as Omit<Exercise, "id">),
    }));

  return {
    id: snap.id,
    name: routineData.name ?? "",
    color: routineData.color ?? "#2563EB",
    exercises,
  } satisfies Routine;
}

/**
 * Resolves an array of routine references into Routine objects.
 */
export async function resolveRoutines(
  items: Array<DocumentReference<DocumentData> | string | unknown>
): Promise<Routine[]> {
  const refs = items.map(toDocRef).filter((ref): ref is DocumentReference<DocumentData> => ref !== null);
  const snaps = await Promise.all(refs.map((ref) => getDoc(ref)));
  const routines = await Promise.all(snaps.map(resolveRoutine));
  return routines.filter((r): r is Routine => r !== null);
}