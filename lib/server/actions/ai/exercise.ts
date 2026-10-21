"use server";

import type { Exercise } from "@/types";
import { randomUUID } from "crypto";
import { generateStructured } from "@/lib/server/ai/client";
import { AiExerciseResponseSchema, type AiExerciseResponse } from "@/lib/schemas/ai-response.schema";
import { withAiTry } from "@/lib/server/ai/guard";
import { AIExerciseRequestSchema } from "@/lib/schemas/ai.schema";
import { getAllExercises } from "@/lib/server/data/exercises";
import { MUSCLE_GROUPS } from "@/data/exercise";
import { getLocalizedText } from "@/lib/utils";
import type { Locale } from "@/types/common";

type ExerciseInput = {
  goal: string;
  difficulty: string;
  equipment: string;
  groups: string[];
  comment?: string;
  idToken: string;
  locale: string;
};

type AiRawResponse = AiExerciseResponse;

const MAX_RETRIES = 2;

export async function generateAiExercise(input: ExerciseInput) {
  const parsed = AIExerciseRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "INVALID_REQUEST" } as const;
  }
  input = { ...input, ...parsed.data };

  return withAiTry(input.idToken, async (userId) => {
    const allExercises = await getAllExercises(userId);
    const relevantExercises = filterRelevantExercises(allExercises, input.groups);
    const existingNames = relevantExercises.map((ex) => getLocalizedText(ex.name, input.locale as Locale));

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const prompt = buildPrompt(input, existingNames, attempt > 0);

      const result = await generateStructured({
        prompt,
        schema: AiExerciseResponseSchema,
      });

      if (!result.success) {
        return result;
      }

      if (!isDuplicate(result.data.exercise.name, existingNames)) {
        return {
          success: true as const,
          data: toExercise(result.data.exercise),
          summary: result.data.summary,
        };
      }
    }

    return { success: false, error: "AI_NOT_UNIQUE" } as const;
  });
}

function filterRelevantExercises(exercises: Exercise[], groups: string[]): Exercise[] {
  if (groups.length === 0) return exercises;

  return exercises.filter((ex) => groups.some((g) => ex.muscleGroup.toLowerCase().includes(g.toLowerCase())));
}

function normalize(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

function isDuplicate(name: string, existing: string[]): boolean {
  const n = normalize(name);
  return existing.some((ex) => {
    const e = normalize(ex);
    return n === e || n.includes(e) || e.includes(n);
  });
}

function buildPrompt(input: ExerciseInput, existingNames: string[], isRetry: boolean): string {
  const exclusionBlock =
    existingNames.length > 0
      ? `
Вправи, які вже є в бібліотеці (НЕ пропонуй їх і не пропонуй функціонально схожі варіанти):
${existingNames.map((n) => `- ${n}`).join("\n")}`
      : "";

  const retryNote = isRetry
    ? "\n\nПопередня відповідь збіглася з існуючою вправою. Запропонуй іншу, унікальну вправу."
    : "";

  return `
Ти — досвідчений фітнес-тренер. Створи одну конкретну вправу.

Параметри:
- Ціль: ${input.goal}
- Рівень: ${input.difficulty}
- Обладнання: ${input.equipment}
- Група м'язів: ${input.groups.join(", ")}
- Коментар користувача: ${input.comment ?? "немає"}
${exclusionBlock}

Поле muscleGroup у відповіді ОБОВʼЯЗКОВО має бути одним із значень: ${MUSCLE_GROUPS.join(", ")}. Не використовуй жодних інших варіантів чи синонімів.
Поля name та description для вправ мають бути на мові ${input.locale}.

Запропонуй одну НОВУ вправу, якої немає в списку вище, з чіткою назвою та коротким описом техніки виконання.${retryNote}
`.trim();
}

function toExercise(raw: AiRawResponse["exercise"]): Exercise {
  return {
    id: randomUUID(),
    name: raw.name,
    description: raw.description,
    muscleGroup: raw.muscleGroup,
    imageUrl: "",
    isCustom: true,
  };
}
