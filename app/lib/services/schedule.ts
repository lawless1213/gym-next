import { db } from "@/app/lib/firebaseConfig";
import { getDoc, doc, DocumentReference, DocumentData } from "firebase/firestore";
import { weekDay, weekDays, ScheduleMap, Routine } from "@/app/types";

type ScheduleDoc = {
  name: weekDay;
  routine: Array<DocumentReference<DocumentData> | string>;
};

function createEmptyScheduleMap(): ScheduleMap {
  return weekDays.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {} as ScheduleMap);
}

export async function getUserScheddule(userId: string): Promise<ScheduleMap> {
  if (!userId) return createEmptyScheduleMap();

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return createEmptyScheduleMap();

    const rawSchedule = userSnap.data().schedule;

    const scheduleInput: ScheduleDoc[] =
      rawSchedule && typeof rawSchedule === "object"
        ? Object.entries(rawSchedule)
            .map(([dayName, dayValue]) => {
              const isValidDay = (weekDays as readonly string[]).includes(dayName);
              if (!isValidDay || !Array.isArray(dayValue)) return null;

              return {
                name: dayName as weekDay,
                routine: dayValue as Array<DocumentReference<DocumentData> | string>,
              } satisfies ScheduleDoc;
            })
            .filter((day): day is ScheduleDoc => day !== null)
        : [];

		
    const scheduleDays = await Promise.all(
      scheduleInput.map(async (item): Promise<{ day: weekDay; routines: Routine[] } | null> => {
        const day = item as Partial<ScheduleDoc>;
        if (!day?.name) return null;

        const rawRoutines = Array.isArray(day.routine) ? day.routine : [];
        const refs: DocumentReference<DocumentData>[] = rawRoutines
          .map((routineItem) => {
            if (routineItem && typeof routineItem === "object" && "id" in routineItem && "path" in routineItem) {
              return routineItem as DocumentReference<DocumentData>;
            }

            if (typeof routineItem === "string" && routineItem.trim()) {
              return doc(db, routineItem) as DocumentReference<DocumentData>;
            }

            return null;
          })
          .filter((ref): ref is DocumentReference<DocumentData> => ref !== null);

        const routineSnaps = await Promise.all(refs.map((ref) => getDoc(ref)));
        const routines: Routine[] = routineSnaps
          .filter((snap) => snap.exists())
          .map((snap) => {
            const routineData = snap.data() as Partial<Routine>;
            return {
              id: snap.id,
              name: routineData.name ?? "",
              color: routineData.color ?? "#2563EB",
              exercises: [],
            } satisfies Routine;
          });

        return {
          day: day.name,
          routines,
        };
      }),
    );

    const scheduleMap = createEmptyScheduleMap();
    scheduleDays.forEach((entry) => {
      if (!entry) return;
      scheduleMap[entry.day] = entry.routines;
    });

    return scheduleMap;
  } catch (error) {
    console.error("Error loading schedule:", error);
    return createEmptyScheduleMap();
  }
}

