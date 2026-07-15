"use client";

import { useEffect, useState } from "react";
import { WorkoutSet } from "@/app/types";

interface SessionShape {
  name: string;
  duration?: number;
  volume?: number;
  exercises: { id: string; sets: WorkoutSet[] }[];
}

export function useWorkoutSession<T extends SessionShape>(initialWorkout: T) {
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
        ex.id === exerciseId
          ? { ...ex, sets: [...ex.sets, { weight: 0, reps: 0, completed: false }] }
          : ex,
      ),
    }));
  };

  const handleRemoveSet = (exerciseId: string) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, sets: ex.sets.slice(0, -1) } : ex,
      ),
    }));
  };

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0,
  );
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const getFinishedWorkout = (): T => ({
    ...workout,
    duration: elapsedTime,
    volume: workout.exercises.reduce(
      (acc, ex) =>
        acc +
        ex.sets
          .filter((s) => s.completed)
          .reduce((setAcc, set) => setAcc + set.weight * set.reps, 0),
      0,
    ),
  });

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
  };
}