// Pure training-volume maths (no Firebase).

type VolumeSet = { reps: number; weight: number; completed?: boolean };
type VolumeWorkout = { exercises: { sets: VolumeSet[] }[] };

/** Sum of reps × weight over completed sets only. */
export function calculateWorkoutVolume(workout: VolumeWorkout): number {
  return workout.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.reduce((sum, set) => (set.completed ? sum + set.reps * set.weight : sum), 0),
    0,
  );
}

export function totalHistoryVolume(workouts: { volume?: number }[]): number {
  return workouts.reduce((total, item) => total + (item.volume ?? 0), 0);
}
