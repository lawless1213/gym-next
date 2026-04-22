import { collection, query, orderBy, limit, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import { WorkoutSession } from "@/app/types";

function calculateWorkoutVolume(workout: WorkoutSession): number {
  return workout.exercises.reduce((workoutTotal, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      if (!set.completed) return setTotal;
      return setTotal + set.reps * set.weight;
    }, 0);
    return workoutTotal + exerciseVolume;
  }, 0);
}

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
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    const workout = {
      id: doc.id,
      ...data,
      startedAt: data.startedAt?.toDate().toISOString(), 
    } as unknown as WorkoutSession;
    return {
      ...workout,
      volume: calculateWorkoutVolume(workout),
    };
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
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    const workout = {
      id: doc.id,
      ...data,
      startedAt: data.startedAt?.toDate().toISOString(), 
    } as unknown as WorkoutSession;
    return {
      ...workout,
      volume: calculateWorkoutVolume(workout),
    };
  });
}