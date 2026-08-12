import type { Timestamp } from "firebase/firestore";
import type { Exercise } from "./exercise";

export interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export type WorkoutExercise = Exercise & { sets: WorkoutSet[] };

export interface QuickWorkoutExercise {
  id: string;
  name: string;
  description?: string;
  muscleGroup?: string;
  imageUrl?: string;
  isCustom?: boolean;
  isQuick?: boolean;
  sets: WorkoutSet[];
}

interface WorkoutSessionBase {
  id: string;
  name: string;
  startedAt: Timestamp;
  duration?: number;
  volume?: number;
}

export interface RegularWorkoutSession extends WorkoutSessionBase {
  isQuick: false;
  routineId: string;
  exercises: WorkoutExercise[];
}

export interface QuickWorkoutSession extends WorkoutSessionBase {
  isQuick: true;
  exercises: QuickWorkoutExercise[];
}

export type WorkoutSession = RegularWorkoutSession | QuickWorkoutSession;