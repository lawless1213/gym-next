import { Locale } from "next-intl";

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