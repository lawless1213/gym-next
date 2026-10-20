// Pure personal-record rules (no Firebase). Used by lib/mutations/record.ts.

export type RecordValue = { weight: number; reps: number };

/** A result beats the record if it is heavier, or equally heavy with more reps. */
export function isNewPersonalRecord(candidate: RecordValue, existing: RecordValue | null | undefined): boolean {
  if (!existing) return true;
  if (candidate.weight > existing.weight) return true;
  return candidate.weight === existing.weight && candidate.reps > existing.reps;
}

type CompletableSet = RecordValue & { completed: boolean };
type RecordableExercise = { id: string; isQuick?: boolean; sets: CompletableSet[] };

/**
 * Best completed set per exercise (heaviest; on equal weight, more reps).
 * Quick (ad-hoc) exercises and exercises without completed sets are skipped.
 */
export function bestSetsByExercise<E extends RecordableExercise>(exercises: E[]): { exercise: E; best: RecordValue }[] {
  const result: { exercise: E; best: RecordValue }[] = [];
  for (const exercise of exercises) {
    if (exercise.isQuick) continue;
    let best: RecordValue | null = null;
    for (const set of exercise.sets) {
      if (!set.completed) continue;
      if (isNewPersonalRecord(set, best)) best = { weight: set.weight, reps: set.reps };
    }
    if (best) result.push({ exercise, best });
  }
  return result;
}
