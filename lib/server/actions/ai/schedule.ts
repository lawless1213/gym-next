"use server";

import { randomUUID } from "crypto";
import { generateStructured } from "@/lib/server/ai/client";
import { AiScheduleResponseSchema, type AiScheduleDay } from "@/lib/schemas/ai-response.schema";
import { withAiTry } from "@/lib/server/ai/guard";
import { AIScheduleRequestSchema } from "@/lib/schemas/ai.schema";
import { getAllExercises } from "@/lib/server/data/exercises";
import { getUserRoutines } from "@/lib/server/data/routines";
import { MUSCLE_GROUPS } from "@/data/exercise";
import { weekDays } from "@/types";
import type { Exercise, Routine, ScheduleMap } from "@/types";
import { getLocalizedText, toLocalizedText, type Locale } from "@/types/common";

type WeekDay = (typeof weekDays)[number];

export type ScheduleInput = {
  goal: string;
  difficulty: string;
  groups: string[];
  equipment: string;
  dayPerWeek: string;
  splitType: string;
  preferredRestDays?: WeekDay[];
  comment?: string;
  idToken: string;
  locale: string;
};

/**
 * Генерує превʼю розкладу тренувань за допомогою ШІ. В базу нічого не пише.
 * Результат готовий для прямої передачі в <WeeklyCalendar schedule={data} />.
 * Нові рутини/вправи позначені id, що починається з "temp-".
 */
export async function generateAiSchedule(input: ScheduleInput) {
  const parsed = AIScheduleRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Некоректні дані запиту." };
  }
  input = { ...input, ...parsed.data };

  return withAiTry(input.idToken, async (userId) => {
    const [allExercises, existingRoutines] = await Promise.all([getAllExercises(userId), getUserRoutines(userId)]);

    const relevantExercises = filterRelevantExercises(allExercises, input.groups);
    const restDays = input.preferredRestDays ?? [];

    const prompt = buildPrompt(input, relevantExercises, existingRoutines, restDays);

    const result = await generateStructured({
      prompt,
      schema: AiScheduleResponseSchema,
    });

    if (!result.success) {
      return result;
    }

    const schedule = createEmptySchedule();

    for (const aiDay of result.data.schedule) {
      if (restDays.includes(aiDay.day)) continue; // підстраховка, навіть якщо AI помилилась
      const routine = resolveDay(aiDay, allExercises, existingRoutines, input.locale as Locale);
      schedule[aiDay.day] = [...schedule[aiDay.day], routine];
    }

    const hasAnyWorkout = weekDays.some((day) => schedule[day].length > 0);
    if (!hasAnyWorkout) {
      return { success: false as const, error: "Не вдалося сформувати розклад тренувань." };
    }

    return { success: true as const, data: schedule, summary: result.data.summary };
  });
}

function resolveDay(
  aiDay: AiScheduleDay,
  allExercises: Exercise[],
  existingRoutines: Routine[],
  locale: Locale = "uk",
): Routine {
  const routineMatch = !aiDay.isNewRoutine ? findRoutineMatch(aiDay.routineName, existingRoutines) : undefined;

  if (routineMatch) {
    return JSON.parse(
      JSON.stringify({
        ...routineMatch,
        available: false,
        completed: false,
        editable: false,
      }),
    );
  }

  const exercises: Exercise[] = (aiDay.exercises ?? []).map((aiEx) => {
    const match = !aiEx.isNew ? findExistingExerciseMatch(aiEx.name, allExercises, locale) : undefined;
    if (match) return match;

    return {
      id: `temp-${randomUUID()}`,
      name: toLocalizedText(aiEx.name),
      muscleGroup: aiEx.muscleGroup,
      isCustom: true,
      description: toLocalizedText(aiEx.description ?? ""),
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

function filterRelevantExercises(exercises: Exercise[], groups: string[]): Exercise[] {
  if (groups.length === 0) return exercises;
  return exercises.filter((ex) => groups.some((g) => ex.muscleGroup.toLowerCase().includes(g.toLowerCase())));
}

function normalize(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

function findExistingExerciseMatch(name: string, existing: Exercise[], locale: Locale = "uk"): Exercise | undefined {
  const n = normalize(name);
  return existing.find((ex) => {
    const e = normalize(getLocalizedText(ex.name, locale));
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
  restDays: WeekDay[],
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
${relevantExercises.map((ex) => `- ${getLocalizedText(ex.name, input.locale as Locale)} (${ex.muscleGroup})`).join("\n")}`
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
Поля name та description для вправ мають бути на мові ${input.locale}.
Поля name для програми мають бути на мові ${input.locale}.

Кількість тренувальних днів у schedule має відповідати "${input.dayPerWeek}" і не включати дні відпочинку.
`.trim();
}
