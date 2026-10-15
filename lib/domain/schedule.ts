// Pure schedule helpers (no Firebase).
import { weekDays, type Routine, type ScheduleMap } from "@/types";

export const EMPTY_SCHEDULE: ScheduleMap = weekDays.reduce((acc, day) => {
  acc[day] = [];
  return acc;
}, {} as ScheduleMap);

/** Monday-based index (0 = Monday … 6 = Sunday). */
export function weekDayIndex(date: Date): number {
  const jsDay = date.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

/**
 * First not-completed routine starting from today and wrapping around the week.
 * Returns a copy with `available` = true only if it is scheduled for today.
 */
export function getNextPendingRoutine(scheduleMap: ScheduleMap, todayDate: Date = new Date()): Routine | null {
  const todayIndex = weekDayIndex(todayDate);

  for (let offset = 0; offset < weekDays.length; offset += 1) {
    const dayIndex = (todayIndex + offset) % weekDays.length;
    const nextRoutine = scheduleMap[weekDays[dayIndex]].find((routine) => !routine.completed);
    if (nextRoutine) return { ...nextRoutine, available: dayIndex === todayIndex };
  }

  return null;
}
