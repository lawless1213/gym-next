"use server";

import { GoogleGenAI } from "@google/genai";
import { weekDays } from "@/app/types";
import type { ScheduleMap, Routine, Exercise, weekDay } from "@/app/types";
import { randomUUID } from "crypto";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const aiExerciseSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    muscleGroup: { type: "string" },
  },
  required: ["name", "description", "muscleGroup"],
};

const scheduleResponseSchema = {
  type: "object",
  properties: {
    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "string", enum: [...weekDays] },
          routineName: { type: "string" },
          color: { type: "string", description: "HEX-колір для рутини, напр. #4F46E5" },
          exercises: {
            type: "array",
            items: aiExerciseSchema,
          },
        },
        required: ["day", "routineName", "color", "exercises"],
      },
    },
    summary: { type: "string" },
  },
  required: ["days", "summary"],
};

type ScheduleInput = {
  goal: string;
  difficulty: string;
  groups: string[];
  equipment: string;
  dayPerWeek: string;
  splitType: string;
  preferredRestDays?: string[];
  comment?: string;
};

type AiRawResponse = {
  days: {
    day: weekDay;
    routineName: string;
    color: string;
    exercises: { name: string; description: string; muscleGroup: string }[];
  }[];
  summary: string;
};

export async function generateAiSchedule(
  input: ScheduleInput
): Promise<{ success: true; data: ScheduleMap; summary: string } | { success: false; error: string }> {
  const prompt = `
Ти — досвідчений фітнес-тренер. Створи план тренувань рівно на ${input.dayPerWeek} тренувальних днів на тиждень.

Параметри:
- Ціль: ${input.goal}
- Рівень: ${input.difficulty}
- Групи м'язів: ${input.groups.join(", ")}
- Обладнання: ${input.equipment}
- Тип спліту: ${input.splitType}
- Дні, які МАЮТЬ бути вихідними (не признач тренування на них): ${input.preferredRestDays?.join(", ") ?? "не вказано"}
- Коментар користувача: ${input.comment ?? "немає"}

Розподіли тренувальні дні рівномірно по тижню (mon..sun), обов'язково пропускаючи дні відпочинку.
Кожен день має мати назву рутини (routineName), колір у HEX та список вправ.
`.trim();

console.log(prompt);


  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: scheduleResponseSchema,
      },
    });

    const parsed: AiRawResponse = JSON.parse(response.text ?? "");

    const scheduleMap = toScheduleMap(parsed);

    return { success: true, data: scheduleMap, summary: parsed.summary };
  } catch (err) {
    console.error("Gemini generation error:", err);
    return { success: false, error: "Не вдалося згенерувати графік" };
  }
}

function toScheduleMap(raw: AiRawResponse): ScheduleMap {
  const map = weekDays.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {} as ScheduleMap);

  for (const entry of raw.days) {
    const exercises: Exercise[] = entry.exercises.map((ex) => ({
      id: randomUUID(),
      name: ex.name,
      description: ex.description,
      muscleGroup: ex.muscleGroup,
      imageUrl: "",
      isCustom: true,
    }));

    const routine: Routine = {
      id: randomUUID(),
      name: entry.routineName,
      exercises,
      color: entry.color,
      available: true,
      completed: false,
      editable: true,
    };

    map[entry.day] = [...map[entry.day], routine];
  }

  return map;
}