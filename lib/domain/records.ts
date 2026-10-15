// Pure personal-record rules (no Firebase). Used by lib/actions/record.ts.

export type RecordValue = { weight: number; reps: number };

/** A result beats the record if it is heavier, or equally heavy with more reps. */
export function isNewPersonalRecord(candidate: RecordValue, existing: RecordValue | null | undefined): boolean {
  if (!existing) return true;
  if (candidate.weight > existing.weight) return true;
  return candidate.weight === existing.weight && candidate.reps > existing.reps;
}
