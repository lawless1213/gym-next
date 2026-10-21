"use client";

import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { WorkoutSession } from "@/types";
import { writeWorkoutSession } from "@/lib/mutations/workout";
import { readPendingWorkouts, removePendingWorkout, savePendingWorkout } from "@/lib/workoutStorage";
import { reportError, reportIssue } from "@/lib/monitoring";
import { queryKeys } from "@/lib/queryKeys";

/** Everything a saved workout changes: history lists, records, and the schedule ("done" marks). */
function useInvalidateWorkoutQueries() {
  const queryClient = useQueryClient();
  return useCallback(
    (userId: string) => {
      for (const queryKey of [
        queryKeys.history.all(userId),
        queryKeys.records.all(userId),
        queryKeys.schedule(userId),
      ]) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
    [queryClient],
  );
}

/**
 * Finish flow shared by the regular and quick workout modals. Works offline:
 * the workout is kept as a pending copy until the server confirms it, the draft is dropped,
 * and the user sees an "offline — will sync" notice instead of a silent failure.
 */
export function useFinishWorkout() {
  const t = useTranslations("workout.finish");
  const invalidate = useInvalidateWorkoutQueries();

  return useCallback(
    (userId: string, workout: WorkoutSession, markFinished: () => void) => {
      savePendingWorkout(userId, workout);
      markFinished();

      let synced: Promise<void>;
      try {
        synced = writeWorkoutSession(userId, workout).synced;
      } catch (error) {
        reportError(error, "Failed to save workout");
        toast.error(t("syncError"));
        return;
      }

      // The history write is already in the local cache, so refetching now shows it.
      invalidate(userId);
      const savedOffline = !navigator.onLine;
      if (savedOffline) toast.info(t("savedOffline"));

      synced
        .then(() => {
          removePendingWorkout(userId, workout.id);
          invalidate(userId);
          if (savedOffline) toast.success(t("synced"), { id: "workout-synced" });
        })
        .catch((error) => {
          reportError(error, "Failed to sync workout");
          toast.error(t("syncError"));
        });
    },
    [invalidate, t],
  );
}

/**
 * Re-sends finished workouts that were never confirmed by the server (e.g. the app was closed
 * offline and the Firestore cache was unavailable). Runs on sign-in and whenever the device
 * comes back online. Mount once, high in the tree.
 */
export function usePendingWorkoutSync(userId: string | undefined) {
  const t = useTranslations("workout.finish");
  const invalidate = useInvalidateWorkoutQueries();
  const inFlight = useRef(new Set<string>());

  useEffect(() => {
    if (!userId) return;

    const resend = () => {
      for (const workout of readPendingWorkouts(userId)) {
        if (inFlight.current.has(workout.id)) continue;
        inFlight.current.add(workout.id);
        writeWorkoutSession(userId, workout)
          .synced.then(() => {
            removePendingWorkout(userId, workout.id);
            invalidate(userId);
            toast.success(t("synced"), { id: "workout-synced" });
          })
          .catch((error) => reportIssue("Failed to re-send pending workout", { error: String(error) }))
          .finally(() => inFlight.current.delete(workout.id));
      }
    };

    resend();
    window.addEventListener("online", resend);
    return () => window.removeEventListener("online", resend);
  }, [userId, invalidate, t]);
}

/** Tells the user an unfinished workout was restored and offers to start over. */
export function useRestoredDraftNotice(restoredFromDraft: boolean, discardDraft: () => void) {
  const t = useTranslations("workout.draft");
  const shown = useRef(false);

  useEffect(() => {
    if (!restoredFromDraft || shown.current) return;
    shown.current = true;
    toast.info(t("restored"), {
      id: "workout-draft-restored",
      action: { label: t("startOver"), onClick: discardDraft },
    });
  }, [restoredFromDraft, discardDraft, t]);
}
