"use server";

import type { Exercise } from "@/app/types";
import { randomUUID } from "crypto";
import { generateStructured } from "./client";

const exerciseResponseSchema = {
  type: "object",
  properties: {
    exercise: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: {
          type: "string",
          description: "Коротка інструкція з техніки виконання",
        },
        muscleGroup: { type: "string" },
      },
      required: ["name", "description", "muscleGroup"],
    },
    summary: { type: "string" },
  },
  required: ["exercise", "summary"],
};

type ExerciseInput = {
  goal: string;
  difficulty: string;
  equipment: string;
  groups: string[];
  comment?: string;
};

type AiRawResponse = {
  exercise: {
    name: string;
    description: string;
    muscleGroup: string;
  };
  summary: string;
};

export async function generateAiExercise(
  input: ExerciseInput
): Promise<{ success: true; data: Exercise; summary: string } | { success: false; error: string }> {
  const prompt = `
Ти — досвідчений фітнес-тренер. Створи одну конкретну вправу.

Параметри:
- Ціль: ${input.goal}
- Рівень: ${input.difficulty}
- Обладнання: ${input.equipment}
- Група м'язів: ${input.groups.join(", ")}
- Коментар користувача: ${input.comment ?? "немає"}

Запропонуй одну вправу, що найкраще відповідає цим параметрам, з чіткою назвою та коротким описом техніки виконання.
`.trim();

  const result = await generateStructured<AiRawResponse>({
    prompt,
    schema: exerciseResponseSchema,
  });

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: toExercise(result.data.exercise),
    summary: result.data.summary,
  };
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