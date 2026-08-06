"use server";

import type { Exercise } from "@/app/types";
import { randomUUID } from "crypto";
import { generateStructured } from "./client";
import { getCommonExercises, getUserExercises } from "@/app/lib/services/exercises";
import { MUSCLE_GROUPS } from "@/app/data/exercise";


type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

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
        muscleGroup: {
          type: "string",
          enum: MUSCLE_GROUPS,
          description: "Одна з дозволених груп м'язів",
        },
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
  userId: string;
  locale: string;
};

type AiRawResponse = {
  exercise: {
    name: string;
    description: string;
    muscleGroup: MuscleGroup;
  };
  summary: string;
};

const MAX_RETRIES = 2;

export async function generateAiExercise(input: ExerciseInput): Promise<{ success: true; data: Exercise; summary: string } | { success: false; error: string }> {
  const allExercises = await getAllExercises(input.userId);
  const relevantExercises = filterRelevantExercises(allExercises, input.groups);
  const existingNames = relevantExercises.map((ex) => ex.name);

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const prompt = buildPrompt(input, existingNames, attempt > 0);
    
    const result = await generateStructured<AiRawResponse>({
      prompt,
      schema: exerciseResponseSchema,
    });

    if (!result.success) {
      return result;
    }

    if (!isValidMuscleGroup(result.data.exercise.muscleGroup)) {
      continue;
    }

    if (!isDuplicate(result.data.exercise.name, existingNames)) {
      return {
        success: true,
        data: toExercise(result.data.exercise),
        summary: result.data.summary,
      };
    }
  }

  return { success: false, error: "Не вдалося згенерувати унікальну вправу. Спробуйте ще раз." };
}

async function getAllExercises(userId: string): Promise<Exercise[]> {
  const [common, user] = await Promise.all([getCommonExercises(), getUserExercises(userId)]);
  return [...common, ...user];
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

function isValidMuscleGroup(value: string): value is MuscleGroup {
  return (MUSCLE_GROUPS as readonly string[]).includes(value);
}

function buildPrompt(input: ExerciseInput, existingNames: string[], isRetry: boolean): string {
  const exclusionBlock =
    existingNames.length > 0
      ? `
Вправи, які вже є в бібліотеці (НЕ пропонуй їх і не пропонуй функціонально схожі варіанти):
${existingNames.map((n) => `- ${n}`).join("\n")}`
      : "";

  const retryNote = isRetry ? "\n\nПопередня відповідь збіглася з існуючою вправою. Запропонуй іншу, унікальну вправу." : "";

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
