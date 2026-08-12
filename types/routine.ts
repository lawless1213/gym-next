import type { Exercise } from "./exercise";

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
  color: string;
  available?: boolean;
  completed?: boolean;
  editable?: boolean;
}