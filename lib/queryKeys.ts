import type { HistoryOptions, Period } from "@/types";

/**
 * TanStack Query keys in one place. Per-user keys start with `[entity, userId]`, so
 * `invalidateQueries({ queryKey: queryKeys.history.all(uid) })` hits every list of that user
 * (prefix match). Always build keys here — inline arrays drift and break invalidation.
 */
export const queryKeys = {
  userParams: (userId: string | undefined) => ["userParams", userId] as const,

  /** Public catalog (`exercises` collection), same for everyone. */
  commonExercises: () => ["commonExercises"] as const,
  /** The user's custom exercises (`users/{uid}/exercises`). */
  userExercises: (userId: string | undefined) => ["exercises", userId] as const,

  routines: (userId: string | undefined) => ["routines", userId] as const,
  schedule: (userId: string | undefined) => ["schedule", userId] as const,

  history: {
    all: (userId: string | undefined) => ["history", userId] as const,
    list: (userId: string | undefined, options: HistoryOptions) => ["history", userId, options] as const,
  },

  records: {
    all: (userId: string | undefined) => ["records", userId] as const,
    list: (userId: string | undefined, period: Period, exerciseIds?: string[]) =>
      ["records", userId, { period, exerciseIds }] as const,
  },

  progress: {
    all: (userId: string | undefined) => ["progress", userId] as const,
    last: (userId: string | undefined, amount: number) => ["progress", userId, { amount }] as const,
  },
};
