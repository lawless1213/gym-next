import { z } from "zod";
import { MUSCLE_GROUPS } from "@/data/exercise";
import { weekDays } from "@/types";

// Gemini response shapes. Single source of truth: the JSON Schema sent to Gemini
// is generated from these (`toGeminiJsonSchema`) and every response is checked with `safeParse`.

const muscleGroup = z.enum(MUSCLE_GROUPS).describe("Одна з дозволених груп м'язів");

export const AiExerciseResponseSchema = z.object({
  exercise: z.object({
    name: z.string().min(1),
    description: z.string().describe("Коротка інструкція з техніки виконання"),
    muscleGroup,
  }),
  summary: z.string(),
});

const AiRoutineExerciseSchema = z.object({
  name: z.string().min(1),
  isNew: z.boolean().describe("true, якщо цієї вправи немає серед існуючих і її треба створити"),
  description: z.string().optional().describe("Коротка інструкція з техніки виконання. Обов'язково, якщо isNew=true"),
  muscleGroup,
});

export const AiRoutineResponseSchema = z.object({
  routine: z.object({
    routineName: z.string().min(1),
    color: z.string().describe("HEX-колір для рутини, напр. #4F46E5"),
    exercises: z.array(AiRoutineExerciseSchema),
  }),
  summary: z.string(),
});

const AiScheduleDaySchema = z.object({
  day: z.enum(weekDays),
  isNewRoutine: z
    .boolean()
    .describe("false, якщо на цей день можна перевикористати ІСНУЮЧУ рутину користувача (тоді вкажи її точну назву в routineName)"),
  routineName: z
    .string()
    .min(1)
    .describe("Точна назва існуючої рутини (якщо isNewRoutine=false) або назва нової рутини (якщо isNewRoutine=true)"),
  color: z.string().optional().describe("HEX-колір, напр. #4F46E5. Обов'язково тільки якщо isNewRoutine=true"),
  exercises: z
    .array(AiRoutineExerciseSchema)
    .optional()
    .describe("Список вправ. Обов'язково тільки якщо isNewRoutine=true"),
});

export const AiScheduleResponseSchema = z.object({
  schedule: z.array(AiScheduleDaySchema),
  summary: z.string(),
});

export type AiExerciseResponse = z.infer<typeof AiExerciseResponseSchema>;
export type AiRoutineResponse = z.infer<typeof AiRoutineResponseSchema>;
export type AiRoutineExercise = z.infer<typeof AiRoutineExerciseSchema>;
export type AiScheduleResponse = z.infer<typeof AiScheduleResponseSchema>;
export type AiScheduleDay = z.infer<typeof AiScheduleDaySchema>;

/** JSON Schema for Gemini `responseJsonSchema` (drops the `$schema` meta key). */
export function toGeminiJsonSchema(schema: z.ZodType): Record<string, unknown> {
  const json = z.toJSONSchema(schema) as Record<string, unknown>;
  delete json.$schema;
  return json;
}
