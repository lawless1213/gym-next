import { collection, query, orderBy, limit, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/config/firebaseConfig";
import { WorkoutSession, HistoryOptions } from "@/types";
import { calculateWorkoutVolume } from "@/lib/domain/volume";
import { getHistoryRange } from "@/lib/domain/periods";

export async function getUserHistory(userId: string, options: HistoryOptions): Promise<WorkoutSession[]> {
  let q;

  if ("amount" in options) {
    q = query(collection(db, `users/${userId}/workoutHistory`), orderBy("startedAt", "desc"), limit(options.amount));
  } else {
    const { from: fromDate, to: toDate } = getHistoryRange(options.period);

    q = query(
      collection(db, `users/${userId}/workoutHistory`),
      where("startedAt", ">=", Timestamp.fromDate(fromDate)),
      where("startedAt", "<=", Timestamp.fromDate(toDate)),
      orderBy("startedAt", "desc"),
      ...(options.limit ? [limit(options.limit)] : []),
    );
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const workout = {
      id: doc.id,
      ...data,
      startedAt: data.startedAt?.toDate().toISOString(),
    } as unknown as WorkoutSession;
    return { ...workout, volume: calculateWorkoutVolume(workout) };
  });
}
