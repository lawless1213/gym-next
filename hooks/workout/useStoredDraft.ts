"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { WorkoutSet } from "@/types";
import { draftKey, parseDraft, readDraftRaw, removeDraft, subscribeDrafts } from "@/lib/workoutStorage";

type DraftShape = { exercises: { sets: WorkoutSet[] }[] };

/**
 * Unfinished workout draft for a slot (routine id or `"quick"`), kept in sync with localStorage.
 * Always `null` during SSR and hydration, then reflects the stored draft.
 */
export function useStoredDraft(userId: string | undefined, slot: string) {
  const key = userId ? draftKey(userId, slot) : null;
  const raw = useSyncExternalStore(
    subscribeDrafts,
    () => (key ? readDraftRaw(key) : null),
    () => null,
  );
  const draft = useMemo(() => parseDraft<DraftShape>(raw), [raw]);

  const completedSets = draft
    ? draft.workout.exercises.reduce((acc, ex) => acc + ex.sets.filter((set) => set.completed).length, 0)
    : 0;

  const discard = useCallback(() => {
    if (key) removeDraft(key);
  }, [key]);

  return { hasDraft: !!draft, completedSets, discard };
}
