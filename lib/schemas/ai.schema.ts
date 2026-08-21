import { DIFFICULTY, EQUIPMENT_GROUPS, GOALS, MUSCLE_GROUPS, SPLIT_TYPES } from "@/data/exercise";
import { weekDays } from "@/types";
import { z } from "zod";

export const AIExerciseSchema = z.object({
  comment: z.string(),
  groups: z.array(z.enum(MUSCLE_GROUPS)).min(1, "at_least_one_checked"),
  equipment: z.enum(EQUIPMENT_GROUPS, {
    message: "at_least_one_checked",
  }),
  difficulty: z.enum(DIFFICULTY, {
    message: "at_least_one_checked",
  }),
  goal: z.enum(GOALS, {
    message: "at_least_one_checked",
  }),
});

export const AIRoutineSchema = z.object({
  comment: z.string().optional(),
  groups: z.array(z.enum(MUSCLE_GROUPS)).min(1, "at_least_one_checked"),
  equipment: z.enum(EQUIPMENT_GROUPS, {
    message: "at_least_one_checked",
  }),
  difficulty: z.enum(DIFFICULTY, {
    message: "at_least_one_checked",
  }),
  goal: z.enum(GOALS, {
    message: "at_least_one_checked",
  }),
  duration: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const num = Number(val);
        return !isNaN(num) && num > 0 && num <= 300;
      },
      { message: "value_too_large" },
    )
    .optional(),
  count: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const num = Number(val);
        return !isNaN(num) && num > 0 && num <= 20;
      },
      { message: "value_too_large" },
    )
    .optional(),
});

export const AIScheduleSchema = z.object({
	comment: z.string().optional(),
	groups: z.array(z.enum(MUSCLE_GROUPS)).min(1, "at_least_one_checked"),
	equipment: z.enum(EQUIPMENT_GROUPS, {
		message: "at_least_one_checked",
	}),
	difficulty: z.enum(DIFFICULTY, {
		message: "at_least_one_checked",
	}),
	goal: z.enum(GOALS, {
		message: "at_least_one_checked",
	}),
	splitType: z.enum(SPLIT_TYPES, {
		message: "at_least_one_checked",
	}),
	preferredRestDays: z.array(z.enum(weekDays)).optional(),
	dayPerWeek: z.string().refine(
		(val) => {
			if (!val) return true;
			const num = Number(val);
			return !isNaN(num) && num > 0 && num <= 7;
		},
		{ message: "value_too_large" },
	),
});

export type AIRoutineAFormData = z.infer<typeof AIRoutineSchema>;
export type AIExerciseFormData = z.infer<typeof AIExerciseSchema>;
export type AIScheduleFormData = z.infer<typeof AIScheduleSchema>;
