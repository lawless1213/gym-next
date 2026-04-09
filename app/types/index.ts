export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  imageUrl: string;
  isCustom?: boolean;
}

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  lastWeight?: number;
  lastReps?: number;
}

export interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
  completed: boolean;
  duration?: number;
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
  color: string;
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weight?: number;
  waist?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
}
