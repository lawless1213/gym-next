import { Timestamp } from "firebase/firestore";

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  imageUrl: string;
  isCustom?: boolean;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id?: string;
  routineId: string;
  routineName: string
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  volume?: number;
  exercises: WorkoutExercise[];
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
  color: string;
  completed?: boolean;
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
  prevReps: number;
  weight: number;
  prevWeight: number;
  workoutId: string;
}

export type RecordsMap = Record<string, PersonalRecord>;

export interface ScheduleDay {
  name: weekDay;
  routines: Routine[];
};

export type ScheduleMap = Record<weekDay, Routine[]>;

export const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type weekDay = typeof weekDays[number];
