"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { PersistReason, WorkoutSet } from "@/types";
import { draftKey, readDraft, removeDraft, writeDraft } from "@/lib/workoutStorage";

interface SessionShape {
  id: string;
  isQuick: boolean;
  name: string;
  duration?: number;
  volume?: number;
  exercises: { id: string; sets: WorkoutSet[] }[];
}

interface UseWorkoutSessionOptions {
  userId: string | undefined;
  /** Draft slot: the routine id for a regular workout, `"quick"` for a quick one. */
  slot: string;
}

export function useWorkoutSession<T extends SessionShape>(
  initialWorkout: T,
  { userId, slot }: UseWorkoutSessionOptions,
) {
  const storageKey = draftKey(userId ?? "anonymous", slot);
  // The modal only mounts in the browser, so reading localStorage in the initializer is safe.
  const [restoredDraft] = useState(() => readDraft<T>(storageKey));
  // Fresh workout from the first render, used by "Start over".
  const [freshWorkout] = useState(initialWorkout);
  const [workout, setWorkout] = useState<T>(restoredDraft?.workout ?? freshWorkout);
  const [elapsedTime, setElapsedTime] = useState(restoredDraft?.elapsedTime ?? 0);
  const [isPaused, setIsPaused] = useState(true);
  const [restoredFromDraft, setRestoredFromDraft] = useState(!!restoredDraft);
  // Set once the workout is saved: stops autosave/unmount handlers from re-creating the draft.
  const finishedRef = useRef(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleUpdateSet = (exerciseId: string, num: number, updates: Partial<WorkoutSet>) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.map((set, idx) => (idx === num ? { ...set, ...updates } : set)) }
          : ex,
      ),
    }));
  };

  const handleAddSet = (exerciseId: string) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, sets: [...ex.sets, { weight: 0, reps: 0, completed: false }] } : ex,
      ),
    }));
  };

  const handleRemoveSet = (exerciseId: string) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => (ex.id === exerciseId ? { ...ex, sets: ex.sets.slice(0, -1) } : ex)),
    }));
  };

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const getFinishedWorkout = (): T => ({
    ...workout,
    duration: elapsedTime,
    volume: workout.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).reduce((setAcc, set) => setAcc + set.weight * set.reps, 0),
      0,
    ),
  });

  const stateRef = useRef({ workout, elapsedTime });
  useEffect(() => {
    stateRef.current = { workout, elapsedTime };
  }, [workout, elapsedTime]);

  const persistWorkoutDraft = useCallback(
    (reason: PersistReason) => {
      if (finishedRef.current) return;
      const { workout: currentWorkout, elapsedTime: currentElapsed } = stateRef.current;
      const hasCompletedSet = currentWorkout.exercises.some((ex) => ex.sets.some((set) => set.completed));

      if (!hasCompletedSet) {
        removeDraft(storageKey);
        return;
      }

      writeDraft(storageKey, { workout: currentWorkout, elapsedTime: currentElapsed, savedAt: Date.now(), reason });
    },
    [storageKey],
  );

  /** Call after the workout is saved: removes the draft and stops further autosaves. */
  const markFinished = useCallback(() => {
    finishedRef.current = true;
    removeDraft(storageKey);
  }, [storageKey]);

  /** "Start over": drop the restored draft and reset to a fresh workout. */
  const discardDraft = useCallback(() => {
    removeDraft(storageKey);
    setWorkout(freshWorkout);
    setElapsedTime(0);
    setIsPaused(true);
    setRestoredFromDraft(false);
  }, [storageKey, freshWorkout]);

  return {
    workout,
    setWorkout,
    elapsedTime,
    isPaused,
    setIsPaused,
    formatTime,
    handleUpdateSet,
    handleAddSet,
    handleRemoveSet,
    totalSets,
    completedSets,
    progress,
    getFinishedWorkout,
    persistWorkoutDraft,
    restoredFromDraft,
    discardDraft,
    markFinished,
  };
}
