"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { PersistReason, WorkoutSet } from "@/app/types";

interface SessionShape {
  id: string;
	isQuick: boolean;
  name: string;
  duration?: number;
  volume?: number;
  exercises: { id: string; sets: WorkoutSet[] }[];
}

interface StoredSession<T> {
  workout: T;
  elapsedTime: number;
  savedAt: number;
	reason: PersistReason;
}

const STORAGE_PREFIX = "workout-session-";

function getStorageKey(isQuick: boolean, workoutId: string) {
	if(isQuick) return `${STORAGE_PREFIX}quick`;
  return `${STORAGE_PREFIX}${workoutId}`;
}

export function useWorkoutSession<T extends SessionShape>(initialWorkout: T) {
	const storageKey = getStorageKey(initialWorkout.isQuick ,initialWorkout.id);
  const [workout, setWorkout] = useState<T>(initialWorkout);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0 ? `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}` : `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleUpdateSet = (exerciseId: string, num: number, updates: Partial<WorkoutSet>) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => (ex.id === exerciseId ? { ...ex, sets: ex.sets.map((set, idx) => (idx === num ? { ...set, ...updates } : set)) } : ex)),
    }));
  };

  const handleAddSet = (exerciseId: string) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => (ex.id === exerciseId ? { ...ex, sets: [...ex.sets, { weight: 0, reps: 0, completed: false }] } : ex)),
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
    volume: workout.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).reduce((setAcc, set) => setAcc + set.weight * set.reps, 0), 0),
  });


  const stateRef = useRef({ workout, elapsedTime });
  useEffect(() => {
    stateRef.current = { workout, elapsedTime };
  }, [workout, elapsedTime]);

  const persistWorkoutDraft = useCallback(
    (reason: PersistReason) => {
      try {
        const { workout: currentWorkout, elapsedTime: currentElapsed } = stateRef.current;
        const payload: StoredSession<T> = {
          workout: currentWorkout,
          elapsedTime: currentElapsed,
          savedAt: Date.now(),
					reason: reason,
        };

        const hasCompletedSet = currentWorkout.exercises.some((ex) =>
          ex.sets.some((set) => set.completed),
        );
  
        if (!hasCompletedSet) {
          if (process.env.NODE_ENV === "development") {
            console.log(`[persistWorkoutDraft] пропущено (немає виконаних сетів), причина: ${reason}`);
          }

          if (window.localStorage.getItem(storageKey)) {
            window.localStorage.removeItem(storageKey);
          }
          return;
        }

        window.localStorage.setItem(storageKey, JSON.stringify(payload));

        if (process.env.NODE_ENV === "development") {
          console.log(`[persistWorkoutDraft] збережено (причина: ${reason})`, payload);
        }
      } catch (error) {
        console.error(`Не вдалося зберегти чернетку тренування (причина: ${reason}):`, error);
      }
    },
    [storageKey],
  );

	const clearStoredWorkout = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Не вдалося очистити чернетку тренування:", error);
    }
  }, [storageKey]);

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
		clearStoredWorkout,
  };
}
