import { db } from "@/app/lib/firebaseConfig";
import { getDoc, doc, DocumentReference, DocumentData } from "firebase/firestore";
import { Exercise, weekDay, weekDays, ScheduleMap, Routine } from "@/app/types";

type ScheduleDoc = {
  name: weekDay;
  routine: Array<DocumentReference<DocumentData> | string>;
};

type RoutineDoc = {
  name?: string;
  color?: string;
  exercises?: Array<DocumentReference<DocumentData> | string>;
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
        const routines: Routine[] = await Promise.all(
          routineSnaps
            .filter((snap) => snap.exists())
            .map(async (snap) => {
              const routineData = snap.data() as RoutineDoc;

              const rawExercises = Array.isArray(routineData.exercises) ? routineData.exercises : [];
              const exerciseRefs: DocumentReference<DocumentData>[] = rawExercises
                .map((exerciseItem) => {
                  if (exerciseItem && typeof exerciseItem === "object" && "id" in exerciseItem && "path" in exerciseItem) {
                    return exerciseItem as DocumentReference<DocumentData>;
                  }

                  if (typeof exerciseItem === "string" && exerciseItem.trim()) {
                    return doc(db, exerciseItem) as DocumentReference<DocumentData>;
                  }

                  return null;
                })
                .filter((ref): ref is DocumentReference<DocumentData> => ref !== null);

              const exerciseSnaps = await Promise.all(exerciseRefs.map((ref) => getDoc(ref)));
              const exercises: Exercise[] = exerciseSnaps
                .filter((exerciseSnap) => exerciseSnap.exists())
                .map((exerciseSnap) => {
                  const exerciseData = exerciseSnap.data() as Omit<Exercise, "id">;
                  return {
                    id: exerciseSnap.id,
                    ...exerciseData,
                  };
                });

              return {
                id: snap.id,
                name: routineData.name ?? "",
                color: routineData.color ?? "#2563EB",
                exercises,
              } satisfies Routine;
            }),
        );

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

