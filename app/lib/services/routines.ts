import { db } from "@/app/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Routine } from "@/app/types";
import { resolveRoutine } from "./firestoreUtils";

export async function getUserRoutines(userId: string): Promise<Routine[]> {
  if (!userId) return [];

  try {
    const routinesRef = collection(db, "users", userId, "routines");
    const routinesSnap = await getDocs(routinesRef);

    const routines = await Promise.all(routinesSnap.docs.map(resolveRoutine));

    return routines.filter((r): r is Routine => r !== null);
  } catch (error) {
    console.error("Error loading routines:", error);
    return [];
  }
}