import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import { RecordsMap } from "@/app/types";
import { Period } from "@/app/types";

export async function getUserRecords(
  userId: string,
  period: Period = "all"
): Promise<RecordsMap> {
  const snap = await getDoc(doc(db, "users", userId, "stats", "records"));

  if (!snap.exists()) return {};

  const records = snap.data() as RecordsMap;

  if (period === "all") return records;

  const now = new Date();
  let startDate: Date;

  if (period === "week") {
    const daysFromMonday = now.getDay() === 0 ? 6 : now.getDay() - 1;
    startDate = new Date(now);
    startDate.setDate(now.getDate() - daysFromMonday);
    startDate.setHours(0, 0, 0, 0);
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const filteredRecords: RecordsMap = {};

  for (const [exerciseId, record] of Object.entries(records)) {
    if (record.date.toDate() >= startDate) {
      filteredRecords[exerciseId] = record;
    }
  }

  return filteredRecords;
}