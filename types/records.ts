import type { Timestamp } from "firebase/firestore";

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