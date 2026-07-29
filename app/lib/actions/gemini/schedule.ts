"use server";

import { randomUUID } from "crypto";
import { db } from "@/app/lib/firebaseConfig";
import { collection, doc, writeBatch, serverTimestamp, arrayUnion } from "firebase/firestore";
import { generateStructured } from "./client";
import { getCommonExercises, getUserExercises } from "@/app/lib/services/exercises";
import { getUserRoutines } from "@/app/lib/services/routines";
import { MUSCLE_GROUPS } from "@/app/data/exercise";
import { weekDays } from "@/app/types";
import type { Exercise, Routine, RoutinesExercise, ScheduleMap } from "@/app/types";

type WeekDay = (typeof weekDays)[number];
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

const scheduleDaySchema = {
  type: "object",
  properties: {
    day: { type: "string", enum: weekDays },
    isNewRoutine: {
      type: "boolean",
      description: "false, якщо на цей день можна перевикористати ІСНУЮЧУ рутину користувача (тоді вкажи її точну назву в routineName)",
    },
    routineName: {
      type: "string",
      description: "Точна назва існуючої рутини (якщо isNewRoutine=false) або назва нової рутини (якщо isNewRoutine=true)",
    },
    color: {
      type: "string",
      description: "HEX-колір, напр. #4F46E5. Обов'язково тільки якщо isNewRoutine=true",
    },
    exercises: {
      type: "array",
      description: "Список вправ. Обов'язково тільки якщо isNewRoutine=true",
      items: routineExerciseSchema,
    },
  },
  required: ["day", "isNewRoutine", "routineName"],
};

const scheduleResponseSchema = {
  type: "object",
  properties: {
    schedule: { type: "array", items: scheduleDaySchema },
    summary: { type: "string" },
  },
  required: ["schedule", "summary"],
};

export type ScheduleInput = {
  goal: string;
  difficulty: string;
  groups: string[];
  equipment: string;
  dayPerWeek: string;
  splitType: string;
  preferredRestDays?: WeekDay[];
  comment?: string;
  userId: string;
};

type AiScheduleDay = {
  day: WeekDay;
  isNewRoutine: boolean;
  routineName: string;
  color?: string;
  exercises?: {
    name: string;
    isNew: boolean;
    description?: string;
    muscleGroup: MuscleGroup;
  }[];
};

type AiRawResponse = {
  schedule: AiScheduleDay[];
  summary: string;
};

/**
 * Генерує превʼю розкладу тренувань за допомогою ШІ. В базу нічого не пише.
 * Результат готовий для прямої передачі в <WeeklyCalendar schedule={data} />.
 * Нові рутини/вправи позначені id, що починається з "temp-".
 */
export async function generateAiSchedule(
  input: ScheduleInput
): Promise<{ success: true; data: ScheduleMap; summary: string } | { success: false; error: string }> {
  const [allExercises, existingRoutines] = await Promise.all([
    getAllExercises(input.userId),
    getUserRoutines(input.userId),
  ]);

  const relevantExercises = filterRelevantExercises(allExercises, input.groups);
  const restDays = input.preferredRestDays ?? [];

  const prompt = buildPrompt(input, relevantExercises, existingRoutines, restDays);
  console.log(prompt);
  

  const result = await generateStructured<AiRawResponse>({
    prompt,
    schema: scheduleResponseSchema,
  });

  if (!result.success) {
    return result;
  }

  const schedule = createEmptySchedule();

  for (const aiDay of result.data.schedule) {
    if (restDays.includes(aiDay.day)) continue; // підстраховка, навіть якщо AI помилилась
    const routine = resolveDay(aiDay, allExercises, existingRoutines);
    schedule[aiDay.day] = [...schedule[aiDay.day], routine];
  }

  const hasAnyWorkout = weekDays.some((day) => schedule[day].length > 0);
  if (!hasAnyWorkout) {
    return { success: false, error: "Не вдалося сформувати розклад тренувань." };
  }

  return { success: true, data: schedule, summary: result.data.summary };
}

function resolveDay(aiDay: AiScheduleDay, allExercises: Exercise[], existingRoutines: Routine[]): Routine {
  const routineMatch = !aiDay.isNewRoutine ? findRoutineMatch(aiDay.routineName, existingRoutines) : undefined;

  if (routineMatch) {
    return JSON.parse(JSON.stringify({ 
      ...routineMatch, 
      available: false, 
      completed: false, 
      editable: false 
    }));
  }

  const exercises: Exercise[] = (aiDay.exercises ?? []).map((aiEx) => {
    const match = !aiEx.isNew ? findExistingExerciseMatch(aiEx.name, allExercises) : undefined;
    if (match) return match;

    return {
      id: `temp-${randomUUID()}`,
      name: aiEx.name,
      muscleGroup: aiEx.muscleGroup,
      isCustom: true,
      description: aiEx.description ?? "",
      imageUrl: "",
    } satisfies Exercise;
  });

  const newRoutine = {
    id: `temp-${randomUUID()}`,
    name: aiDay.routineName,
    color: aiDay.color ?? "#4F46E5",
    exercises,
    available: false,
    completed: false,
    editable: false,
  };

  return JSON.parse(JSON.stringify(newRoutine));
}

function createEmptySchedule(): ScheduleMap {
  return weekDays.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {} as ScheduleMap);
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

function findExistingExerciseMatch(name: string, existing: Exercise[]): Exercise | undefined {
  const n = normalize(name);
  return existing.find((ex) => {
    const e = normalize(ex.name);
    return n === e || n.includes(e) || e.includes(n);
  });
}

function findRoutineMatch(name: string, existing: Routine[]): Routine | undefined {
  const n = normalize(name);
  return existing.find((r) => {
    const e = normalize(r.name);
    return n === e || n.includes(e) || e.includes(n);
  });
}

function buildPrompt(
  input: ScheduleInput,
  relevantExercises: Exercise[],
  existingRoutines: Routine[],
  restDays: WeekDay[]
): string {
  const routinesBlock =
    existingRoutines.length > 0
      ? `
Існуючі рутини (тренування) користувача, які МОЖНА і треба пріоритетно перевикористовувати на підходящі дні:
${existingRoutines.map((r) => `- "${r.name}": ${r.exercises.map((e) => e.name).join(", ")}`).join("\n")}

Для дня, де підходить існуюча рутина цілком — виставляй isNewRoutine=false і routineName = точна назва рутини зі списку вище. НЕ передавай exercises і color для такого дня.`
      : "";

  const exercisesBlock =
    relevantExercises.length > 0
      ? `
Існуючі окремі вправи користувача (використовуй їх при складанні НОВИХ рутин, якщо підходять):
${relevantExercises.map((ex) => `- ${ex.name} (${ex.muscleGroup})`).join("\n")}`
      : "";

  const restDaysBlock =
    restDays.length > 0
      ? `\nДні відпочинку (НЕ додавай тренування на ці дні, взагалі не включай їх у schedule): ${restDays.join(", ")}`
      : "";

  return `
Ти — досвідчений фітнес-тренер. Склади тижневий розклад тренувань.

Параметри:
- Ціль: ${input.goal}
- Рівень: ${input.difficulty}
- Групи м'язів: ${input.groups.join(", ")}
- Обладнання: ${input.equipment}
- Кількість тренувальних днів на тиждень: ${input.dayPerWeek}
- Тип спліту: ${input.splitType}
- Коментар користувача: ${input.comment ?? "немає"}
${restDaysBlock}
${routinesBlock}
${exercisesBlock}

Для кожного тренувального дня (масив schedule) вкажи day (код дня тижня), isNewRoutine, routineName.
Якщо isNewRoutine=true — додатково вкажи color (HEX) та exercises: список вправ на цей день, кожна з полями name, isNew, muscleGroup (одне з: ${MUSCLE_GROUPS.join(", ")}) і description (тільки якщо isNew=true).

Кількість тренувальних днів у schedule має відповідати "${input.dayPerWeek}" і не включати дні відпочинку.
`.trim();
}