import type { Routine } from "./routine";

export const weekDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type weekDay = typeof weekDays[number];

export interface ScheduleDay {
  name: weekDay;
  routines: Routine[];
}

export type ScheduleMap = Record<weekDay, Routine[]>;