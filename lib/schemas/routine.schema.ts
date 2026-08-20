import { RoutinesExercise } from "@/types";
import { z } from "zod";

export const routineSchema = z.object({
	title: z.string().min(3, "title_too_small").max(100, "title_too_large"),
	color: z.string().min(1, "at_least_one_required"),
	exercises: z.array(z.custom<RoutinesExercise>()).min(1, "at_least_one_required"),
});

export type RoutineFormData = z.infer<typeof routineSchema>;