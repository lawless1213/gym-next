"use server";

import type { Routine, Exercise } from "@/app/types";
import { randomUUID } from "crypto";
import { generateStructured } from "./client";

const aiExerciseSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    muscleGroup: { type: "string" },
  },
  required: ["name", "description", "muscleGroup"],
};

const routineResponseSchema = {
  type: "object",
  properties: {
    routine: {
      type: "object",
      properties: {
        routineName: { type: "string" },
        color: { type: "string", description: "HEX-колір для рутини, напр. #4F46E5" },
        exercises: {
          type: "array",
          items: aiExerciseSchema,
        },
      },
      required: ["routineName", "color", "exercises"],
    },
    summary: { type: "string" },
  },
  required: ["routine", "summary"],
};

type RoutineInput = {
  goal: string;
  difficulty: string;
  groups: string[];
  equipment: string;
  duration?: string;
  count?: string;
  comment?: string;
};

type AiRawResponse = {
  routine: {
    routineName: string;
    color: string;
    exercises: { name: string; description: string; muscleGroup: string }[];
  };
  summary: string;
};

export async function generateAiRoutine(
  input: RoutineInput
): Promise<{ success: true; data: Routine; summary: string } | { success: false; error: string }> {
  const prompt = `
Ти — досвідчений фітнес-тренер. Створи одну тренувальну рутину.

Параметри:
- Ціль: ${input.goal}
- Рівень: ${input.difficulty}
- Групи м'язів: ${input.groups.join(", ")}
- Обладнання: ${input.equipment}
${input.duration ? `- Тривалість тренування: ${input.duration} хв` : ""}
${input.count ? `- Кількість вправ: ${input.count}` : ""}
- Коментар користувача: ${input.comment ?? "немає"}

Рутина має мати назву (routineName), колір у HEX та список вправ, що відповідають заданим параметрам.
`.trim();

  const result = await generateStructured<AiRawResponse>({
    prompt,
    schema: routineResponseSchema,
  });

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: toRoutine(result.data.routine),
    summary: result.data.summary,
  };
}

function toRoutine(raw: AiRawResponse["routine"]): Routine {
  const exercises: Exercise[] = raw.exercises.map((ex) => ({
    id: randomUUID(),
    name: ex.name,
    description: ex.description,
    muscleGroup: ex.muscleGroup,
    imageUrl: "",
    isCustom: true,
  }));

  return {
    id: randomUUID(),
    name: raw.routineName,
    exercises,
    color: raw.color,
    available: false,
    completed: false,
    editable: false,
  };
}