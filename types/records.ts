import type { Timestamp } from "firebase/firestore";
import { LocalizedText } from "./common";

export interface PersonalRecord {
  date: Timestamp;
  exerciseName: LocalizedText;
  reps: number;
  prevReps?: number;
  weight: number;
  prevWeight?: number;
  exerciseId: string;
}

export type RecordsMap = Record<string, PersonalRecord>;