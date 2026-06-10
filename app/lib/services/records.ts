import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import { RecordsMap } from "@/app/types";

export async function getUserRecords(
  userId: string
): Promise<RecordsMap> {
  const snap = await getDoc(doc(db, 'users', userId, 'stats', 'records'));
	const records = snap.data() as RecordsMap;
	
  return records;
}

export async function getUserRecordsThisWeek(
  userId: string
): Promise<RecordsMap> {
  const snap = await getDoc(doc(db, "users", userId, "stats", "records"));

  if (!snap.exists()) return {};

  const records = snap.data() as RecordsMap;

  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - daysFromMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const weeklyRecords: RecordsMap = {};

  for (const [exerciseId, record] of Object.entries(records)) {
    const recordDate: Date = record.date.toDate();

    if (recordDate >= startOfWeek && recordDate < endOfWeek) {
      weeklyRecords[exerciseId] = record;
    }
  }

  return weeklyRecords;
}