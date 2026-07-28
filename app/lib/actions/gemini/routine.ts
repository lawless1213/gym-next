"use server";

import { randomUUID } from "crypto";
import { generateStructured } from "./client";
import { getCommonExercises, getUserExercises } from "@/app/lib/services/exercises";
import { MUSCLE_GROUPS } from "@/app/data/exercise";
import type { Exercise } from "@/app/types";

type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

const routineExerciseSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    isNew: {
      type: "boolean",
      description: "true, якщо цієї вправи немає серед існуючих і її треба створити",
    },
    description: {
      type: "string",
      description: "Коротка інструкція з техніки виконання. Обов'язково, якщо isNew=true",
    },
    muscleGroup: { type: "string", enum: MUSCLE_GROUPS },
  },
  required: ["name", "isNew", "muscleGroup"],
};

const routineResponseSchema = {
  type: "object",
  properties: {
    routine: {
      type: "object",
      properties: {
        routineName: { type: "string" },
        color: { type: "string", description: "HEX-колір для рутини, напр. #4F46E5" },
        exercises: { type: "array", items: routineExerciseSchema },
      },
      required: ["routineName", "color", "exercises"],
    },
    summary: { type: "string" },
  },
  required: ["routine", "summary"],
};

export type RoutineInput = {
  goal: string;
  difficulty: string;
  groups: string[];
  equipment: string;
  duration?: string;
  count?: string;
  comment?: string;
  userId: string;
};

type AiRoutineExercise = {
  name: string;
  isNew: boolean;
  description?: string;
  muscleGroup: MuscleGroup;
};

type AiRawResponse = {
  routine: {
    routineName: string;
    color: string;
    exercises: AiRoutineExercise[];
  };
  summary: string;
};

export type GeneratedRoutine = {
  name: string;
  color: string;
  exercises: Exercise[];
};

/**
 * Генерує превʼю рутини за допомогою ШІ. В базу нічого не пише.
 */
export async function generateAiRoutine(
  input: RoutineInput
): Promise<{ success: true; data: GeneratedRoutine; summary: string } | { success: false; error: string }> {
  const allExercises = await getAllExercises(input.userId);
  const relevantExercises = filterRelevantExercises(allExercises, input.groups);

  const prompt = buildPrompt(input, relevantExercises);

  const result = await generateStructured<AiRawResponse>({
    prompt,
    schema: routineResponseSchema,
  });

  if (!result.success) {
    return result;
  }

  const exercises = result.data.routine.exercises.map((aiEx) => {
    const match = !aiEx.isNew ? findExistingMatch(aiEx.name, relevantExercises) : undefined;

    // Якщо знайшли існуючу вправу — повертаємо її як є з її реальним id
    if (match) {
      return match;
    }

    // Для нової вправи генеруємо тимчасовий id із префіксом 'temp-' для React key
    return {
      id: `temp-${randomUUID()}`,
      name: aiEx.name,
      muscleGroup: aiEx.muscleGroup,
      isCustom: true,
      description: aiEx.description ?? "",
      imageUrl: "",
    } satisfies Exercise;
  });

  if (exercises.length === 0) {
    return { success: false, error: "Не вдалося сформувати список вправ для рутини." };
  }

  return {
    success: true,
    data: {
      name: result.data.routine.routineName,
      color: result.data.routine.color,
      exercises,
    },
    summary: result.data.summary,
  };
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

function findExistingMatch(name: string, existing: Exercise[]): Exercise | undefined {
  const n = normalize(name);
  return existing.find((ex) => {
    const e = normalize(ex.name);
    return n === e || n.includes(e) || e.includes(n);
  });
}

function buildPrompt(input: RoutineInput, existing: Exercise[]): string {
  const existingBlock =
    existing.length > 0
      ? `
Існуючі вправи користувача, які МОЖНА і треба пріоритетно використовувати (якщо підходять під параметри):
${existing.map((ex) => `- ${ex.name} (${ex.muscleGroup})`).join("\n")}

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

Рутина має мати назву (routineName), колір у HEX та список вправ (комбінація існуючих і, за потреби, нових), що відповідають заданим параметрам.
`.trim();
}