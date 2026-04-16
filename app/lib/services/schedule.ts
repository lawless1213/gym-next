import { db } from "@/app/lib/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { weekDay, weekDays, ScheduleMap } from "@/app/types";
import { toDocRef, resolveRoutines } from "./firestoreUtils";

function createEmptyScheduleMap(): ScheduleMap {
  return weekDays.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {} as ScheduleMap);
}

export async function getUserSchedule(userId: string): Promise<ScheduleMap> {
  if (!userId) return createEmptyScheduleMap();

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return createEmptyScheduleMap();

    const rawSchedule = userSnap.data().schedule;

    if (!rawSchedule || typeof rawSchedule !== "object") {
      return createEmptyScheduleMap();
    }

    const scheduleMap = createEmptyScheduleMap();

    await Promise.all(
      Object.entries(rawSchedule).map(async ([dayName, dayValue]) => {
        const isValidDay = (weekDays as readonly string[]).includes(dayName);
        if (!isValidDay || !Array.isArray(dayValue)) return;

        const routines = await resolveRoutines(dayValue);
        scheduleMap[dayName as weekDay] = routines;
      })
    );

    return scheduleMap;
  } catch (error) {
    console.error("Error loading schedule:", error);
    return createEmptyScheduleMap();
  }
}