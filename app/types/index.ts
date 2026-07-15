import { Timestamp } from "firebase/firestore";

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  imageUrl: string;
  isCustom: boolean;
}

export interface RoutinesExercise {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  isCustom: boolean;
}

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
  sets: WorkoutSet[]
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


// export interface WorkoutSession {
//   id: string;
//   routineId?: string;
//   name: string;
//   startedAt: Timestamp;
//   duration?: number;
//   volume?: number;
//   isQuick: boolean;
//   exercises: QuickWorkoutExercise[] | WorkoutExercise[];
// }

// export interface QuickWorkoutSession {
//   id: string;
//   name: string;
//   startedAt: Timestamp;
//   duration?: number;
//   volume?: number;
//   exercises: QuickWorkoutExercise[] | WorkoutExercise[];
// }

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
  color: string;
  available?: boolean;
  completed?: boolean;
  editable?: boolean;
}

export interface Measurement {
  date: Date;
  value: number;
}

export interface BodyProgress {
  arms: Measurement[];
  chest: Measurement[];
  thighs: Measurement[];
  waist: Measurement[];
  weight: Measurement[];
}

export interface PersonalRecord {
  date: Timestamp;
  exerciseName: string;
  reps: number;
  prevReps?: number;
  weight: number;
  prevWeight?: number;
  exerciseId: string;
}

export type RecordsMap = Record<string, PersonalRecord>;

export interface ScheduleDay {
  name: weekDay;
  routines: Routine[];
};

export type ScheduleMap = Record<weekDay, Routine[]>;

export const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type weekDay = typeof weekDays[number];

export type Period = "week" | "month" | "all";

export type HistoryOptions =
  | { period: "week" | "prev-week" | "current-week" | "month" | "year"; limit?: number }
  | { amount: number };

export type PersistReason =
  | "modal-close"
  | "before-unload"
  | "page-hide"
  | "visibility-hidden"
  | "network-offline"
  | "component-unmount"
  | "periodic-autosave"
  | "sync-failed";