import type { LocalizedText } from "@/types/common";

export interface Exercise {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  muscleGroup: string;
  imageUrl: string;
  isCustom: boolean;
}

export interface RoutinesExercise {
  exerciseId: string;
  name: LocalizedText;
  muscleGroup: string;
  isCustom: boolean;
}