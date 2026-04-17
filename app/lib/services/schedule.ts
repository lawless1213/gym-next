import { db } from "@/app/lib/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { weekDay, weekDays, ScheduleMap, Routine } from "@/app/types";
import { toDocRef, resolveRoutines } from "./firestoreUtils";
import { getDateOfWeek } from "../utils";
import { getUserHistoryForPeriod } from "./history";

function getWeekDayFromDate(date: Date): weekDay {
  const dayIndex = date.getDay();
  const normalizedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return weekDays[normalizedIndex];
}

function createEmptyScheduleMap(): ScheduleMap {
  return weekDays.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {} as ScheduleMap);
}

export function getNextPendingRoutine(
  scheduleMap: ScheduleMap,
  todayDate: Date = new Date()
): Routine | null {
  const jsDay = todayDate.getDay();
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;

  for (let dayIndex = todayIndex; dayIndex < weekDays.length; dayIndex += 1) {
    const day = weekDays[dayIndex];
    const nextRoutine = scheduleMap[day].find((routine) => !routine.completed);

    if (nextRoutine) {
      return nextRoutine;
    }
  }

  return null;
}

export async function getUserSchedule(userId: string): Promise<ScheduleMap> {
  if (!userId) return createEmptyScheduleMap();

  const startOfWeek = getDateOfWeek('start');
  const endOfWeek = getDateOfWeek('end');
  
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return createEmptyScheduleMap();

    const rawSchedule = userSnap.data().schedule;

    if (!rawSchedule || typeof rawSchedule !== "object") {
      return createEmptyScheduleMap();
    }

    const scheduleMap = createEmptyScheduleMap();

    const history = await getUserHistoryForPeriod(userId, startOfWeek, endOfWeek);
    const completedRoutineByDay = new Set(
      history.map((session) => {
        const day = getWeekDayFromDate(new Date(session.startedAt as unknown as string));
        return `${day}:${session.routineId}`;
      }),
    );

    await Promise.all(
      Object.entries(rawSchedule).map(async ([dayName, dayValue]) => {
        const isValidDay = (weekDays as readonly string[]).includes(dayName);
        if (!isValidDay || !Array.isArray(dayValue)) return;

        const routines = await resolveRoutines(dayValue);
        const day = dayName as weekDay;
        scheduleMap[day] = routines.map((routine) => ({
          ...routine,
          completed: completedRoutineByDay.has(`${day}:${routine.id}`),
        }));
      }),
    );

    return scheduleMap;
  } catch (error) {
    console.error("Error loading schedule:", error);
    return createEmptyScheduleMap();
  }
}
