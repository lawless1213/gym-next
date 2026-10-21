"use server";

import { randomUUID } from "crypto";
import { generateStructured } from "@/lib/server/ai/client";
import { AiRoutineResponseSchema } from "@/lib/schemas/ai-response.schema";
import { withAiTry } from "@/lib/server/ai/guard";
import { AIRoutineRequestSchema } from "@/lib/schemas/ai.schema";
import { getAllExercises } from "@/lib/server/data/exercises";
import { MUSCLE_GROUPS } from "@/data/exercise";
import type { Exercise } from "@/types";
import { getLocalizedText, toLocalizedText } from "@/lib/utils";
import { Locale } from "next-intl";

export type RoutineInput = {
  goal: string;
  difficulty: string;
  groups: string[];
  equipment: string;
  duration?: string;
  count?: string;
  comment?: string;
  idToken: string;
  locale: string;
};

export type GeneratedRoutine = {
  name: string;
  color: string;
  exercises: Exercise[];
};

export async function generateAiRoutine(input: RoutineInput) {
  const parsed = AIRoutineRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "INVALID_REQUEST" } as const;
  }
  input = { ...input, ...parsed.data };

  return withAiTry(input.idToken, async (userId) => {
    const allExercises = await getAllExercises(userId);
    const relevantExercises = filterRelevantExercises(allExercises, input.groups);

    const prompt = buildPrompt(input, relevantExercises);

    const result = await generateStructured({
      prompt,
      schema: AiRoutineResponseSchema,
    });

    if (!result.success) {
      return result;
    }

    const exercises = result.data.routine.exercises.map((aiEx) => {
      const match = !aiEx.isNew ? findExistingMatch(aiEx.name, relevantExercises, input.locale as Locale) : undefined;

      if (match) {
        return match;
      }

      return {
        id: `temp-${randomUUID()}`,
        name: toLocalizedText(aiEx.name),
        muscleGroup: aiEx.muscleGroup,
        isCustom: true,
        description: toLocalizedText(aiEx.description ?? ""),
        imageUrl: "",
      } satisfies Exercise;
    });

    if (exercises.length === 0) {
      return { success: false, error: "AI_INVALID_RESPONSE" } as const;
    }

    const rawData: GeneratedRoutine = {
      name: result.data.routine.routineName,
      color: result.data.routine.color,
      exercises,
    };

    const cleanData: GeneratedRoutine = JSON.parse(JSON.stringify(rawData));

    return {
      success: true as const,
      data: cleanData,
      summary: result.data.summary,
    };
  });
}

function filterRelevantExercises(exercises: Exercise[], groups: string[]): Exercise[] {
  if (groups.length === 0) return exercises;
  return exercises.filter((ex) => groups.some((g) => ex.muscleGroup.toLowerCase().includes(g.toLowerCase())));
}

function normalize(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

function findExistingMatch(name: string, existing: Exercise[], locale: Locale = "uk"): Exercise | undefined {
  const n = normalize(name);
  return existing.find((ex) => {
    const e = normalize(getLocalizedText(ex.name, locale));
    return n === e || n.includes(e) || e.includes(n);
  });
}

function buildPrompt(input: RoutineInput, existing: Exercise[]): string {
  const existingBlock =
    existing.length > 0
      ? `
Існуючі вправи користувача, які МОЖНА і треба пріоритетно використовувати (якщо підходять під параметри):
${existing.map((ex) => `- ${getLocalizedText(ex.name, input.locale as Locale)} (${ex.muscleGroup})`).join("\n")}

Для таких вправ виставляй isNew=false і НЕ пиши description — просто вкажи точну назву як у списку вище.`
      : "";

  return `
Ти — досвідчений фітнес-тренер. Створи одну тренувальну рутину.

Параметри:
- Ціль: ${input.goal}
- Рівень: ${input.difficulty}
- Групи м'язів: ${input.groups.join(", ")}
- Обладнання: ${input.equipment}
${input.duration ? `- Тривалість тренування: ${input.duration} хв` : ""}
${input.count ? `- Кількість вправ: ${input.count}` : ""}
- Коментар користувача: ${input.comment ?? "немає"}
${existingBlock}

Якщо серед існуючих вправ немає підходящої під якийсь етап тренування — створи нову вправу (isNew=true) з чіткою назвою, коротким описом техніки та групою м'язів.

Поле muscleGroup для КОЖНОЇ вправи ОБОВʼЯЗКОВО має бути одним із значень: ${MUSCLE_GROUPS.join(", ")}.
Поля name та description для вправ мають бути на мові ${input.locale}.
Поля name для програми мають бути на мові ${input.locale}.


Рутина має мати назву (routineName), колір у HEX та список вправ (комбінація існуючих і, за потреби, нових), що відповідають заданим параметрам.
`.trim();
}
