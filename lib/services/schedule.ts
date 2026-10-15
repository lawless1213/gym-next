import { db } from "@/lib/config/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { weekDay, weekDays, ScheduleMap, RegularWorkoutSession } from "@/types";
import { resolveRoutines } from "./firestoreUtils";
import { getUserHistory } from "./history";

export { EMPTY_SCHEDULE, getNextPendingRoutine } from "@/lib/domain/schedule";
import { EMPTY_SCHEDULE, weekDayIndex } from "@/lib/domain/schedule";

function getWeekDayFromDate(date: Date): weekDay {
  return weekDays[weekDayIndex(date)];
}

export async function getUserSchedule(userId: string): Promise<ScheduleMap> {
  if (!userId) return EMPTY_SCHEDULE;

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return EMPTY_SCHEDULE;

    const rawSchedule = userSnap.data().schedule;

    if (!rawSchedule || typeof rawSchedule !== "object") {
      return EMPTY_SCHEDULE;
    }

    const scheduleMap = EMPTY_SCHEDULE;

    const history = await getUserHistory(userId, { period: "current-week" });
    const completedRoutineByDay = new Set(
      history
        .filter((session): session is RegularWorkoutSession => !session.isQuick)
        .map((session) => {
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
    return EMPTY_SCHEDULE;
  }
}
