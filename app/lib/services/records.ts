import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import { RecordsMap } from "@/app/types";
import { Period } from "@/app/types";


export async function getUserRecords(
  userId: string,
  period: Period = "all",
  exerciseIds?: string[]
): Promise<RecordsMap> {
  const snap = await getDoc(doc(db, "users", userId, "stats", "records"));

  if (!snap.exists()) return {};

  const records = snap.data() as RecordsMap;

  let startDate: Date | null = null;
  if (period !== "all") {
    const now = new Date();
    if (period === "week") {
      const daysFromMonday = now.getDay() === 0 ? 6 : now.getDay() - 1;
      startDate = new Date(now);
      startDate.setDate(now.getDate() - daysFromMonday);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
  }

  if (period === "all" && !exerciseIds) return records;

  const filteredRecords: RecordsMap = {};

  for (const [exerciseId, record] of Object.entries(records)) {
    const matchesExercise = exerciseIds ? exerciseIds.includes(exerciseId) : true;
    const matchesPeriod = startDate ? record.date.toDate() >= startDate : true;
    if (matchesExercise && matchesPeriod) {
      filteredRecords[exerciseId] = record;
    }
  }

  return filteredRecords;
}