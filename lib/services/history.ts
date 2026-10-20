import { collection, query, orderBy, limit, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/config/firebaseConfig";
import { WorkoutSession, HistoryOptions } from "@/types";
import { calculateWorkoutVolume } from "@/lib/domain/volume";
import { getHistoryRange } from "@/lib/domain/periods";

/**
 * Timestamp → ISO string. Also accepts a `{ seconds, nanoseconds }` map (workouts saved from a
 * badly revived offline copy, see lib/workoutStorage.ts) so one bad doc can't break the whole list.
 */
function toIsoDate(value: unknown): string | undefined {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value && typeof value === "object" && typeof (value as { seconds?: unknown }).seconds === "number") {
    return new Date((value as { seconds: number }).seconds * 1000).toISOString();
  }
  return undefined;
}

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
      startedAt: toIsoDate(data.startedAt),
    } as unknown as WorkoutSession;
    return { ...workout, volume: calculateWorkoutVolume(workout) };
  });
}
