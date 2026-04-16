import { collection, query, orderBy, limit, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import { WorkoutSession } from "@/app/types";

export async function getUserHistoryForPeriod(
  userId: string,
  fromDate: Date,
  toDate: Date
): Promise<WorkoutSession[]> {
  const q = query(
    collection(db, `users/${userId}/workoutHistory`),
    where("startedAt", ">=", Timestamp.fromDate(fromDate)),
    where("startedAt", "<=", Timestamp.fromDate(toDate)),
    orderBy("startedAt", "desc")
  );

  const snapshot = await getDocs(q);

	console.log(snapshot);
	
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Конвертуємо Timestamp у формат, який "розуміє" Next.js props
      startedAt: data.startedAt?.toDate().toISOString(), 
    } as unknown as WorkoutSession;
  });
}

export async function getUserLastHistory(
  userId: string,
  amount: number
): Promise<WorkoutSession[]> {
  const q = query(
    collection(db, `users/${userId}/workoutHistory`),
    orderBy("startedAt", "desc"),
    limit(amount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutSession));
}