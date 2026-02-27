export interface Exercise {
  id: string;
  name: string;
  author: string;
  authorName: string;
  bodyPart: string[];
  equipment: string[];
  caloriesPerSet: number;
  caloriesPerUnit: number;
  description: string;
  preview: string;
  video: string;
  createdAt: string | any;
	type: "reps" | "time";
	valuePerSet: number;
}