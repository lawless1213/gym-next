import { DIFFICULTY, EQUIPMENT_GROUPS, GOALS, MUSCLE_GROUPS, SPLIT_TYPES } from "@/data/exercise";
import { weekDays } from "@/types";
import { LOCALES } from "@/i18n/locales";
import { z } from "zod";

export const AI_COMMENT_MAX = 500;
export const AI_CHAT_MESSAGE_MAX = 2000;
export const AI_CHAT_HISTORY_TEXT_MAX = 8000;
export const AI_CHAT_HISTORY_MAX = 10;

const aiComment = z.string().trim().max(AI_COMMENT_MAX, "value_too_large");

export const AIExerciseSchema = z.object({
  comment: aiComment,
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
  comment: aiComment.optional(),
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
	comment: aiComment.optional(),
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

// Server-side request schemas (form data + locale). Validate BEFORE charging an AI try.
const aiLocale = z.enum(LOCALES);
export const AIExerciseRequestSchema = AIExerciseSchema.extend({ locale: aiLocale });
export const AIRoutineRequestSchema = AIRoutineSchema.extend({ locale: aiLocale });
export const AIScheduleRequestSchema = AIScheduleSchema.extend({ locale: aiLocale });

export const AIChatRequestSchema = z.object({
  history: z
    .array(
      z.object({
        id: z.string().max(100),
        role: z.enum(["user", "model"]),
        text: z.string().min(1).max(AI_CHAT_HISTORY_TEXT_MAX),
      }),
    )
    .max(200)
    .transform((messages) => messages.slice(-AI_CHAT_HISTORY_MAX)),
  message: z.string().trim().min(1).max(AI_CHAT_MESSAGE_MAX),
});
