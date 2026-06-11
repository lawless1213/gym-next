import { collection, query, orderBy, limit, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import { WorkoutSession, HistoryOptions } from "@/app/types";

function calculateWorkoutVolume(workout: WorkoutSession): number {
  return workout.exercises.reduce((workoutTotal, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      if (!set.completed) return setTotal;
      return setTotal + set.reps * set.weight;
    }, 0);
    return workoutTotal + exerciseVolume;
  }, 0);
}

export async function getUserHistory(
  userId: string,
  options: HistoryOptions
): Promise<WorkoutSession[]> {
  let q;

  if ("amount" in options) {
    q = query(
      collection(db, `users/${userId}/workoutHistory`),
      orderBy("startedAt", "desc"),
      limit(options.amount)
    );
  } else {
    const now = new Date();

    const fromDate = {
      week: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
      "prev-week": new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14),
      month: new Date(now.getFullYear(), now.getMonth(), 1),
      year: new Date(now.getFullYear(), 0, 1),
    }[options.period];

    const toDate = options.period === "prev-week"
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      : now;

    q = query(
      collection(db, `users/${userId}/workoutHistory`),
      where("startedAt", ">=", Timestamp.fromDate(fromDate)),
      where("startedAt", "<=", Timestamp.fromDate(toDate)),
      orderBy("startedAt", "desc"),
      ...(options.limit ? [limit(options.limit)] : [])
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