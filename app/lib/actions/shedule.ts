import { db } from "@/app/lib/firebaseConfig";
import { Routine, RoutinesExercise, ScheduleMap, weekDays } from "@/app/types";
import { updateDoc, doc, writeBatch, arrayUnion, collection, serverTimestamp} from "firebase/firestore";

export async function createAiUserSchedule(userId: string, schedule: ScheduleMap) {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const scheduleUpdate: Record<string, ReturnType<typeof arrayUnion>> = {};

  for (const day of weekDays) {
    const routines = schedule[day];
    if (!routines || routines.length === 0) continue;

    const routineRefs = routines.map((routine) => persistRoutine(batch, userId, routine));
    scheduleUpdate[`schedule.${day}`] = arrayUnion(...routineRefs);
  }

  if (Object.keys(scheduleUpdate).length === 0) {
    return { success: false as const, error: "Немає тренувальних днів для збереження." };
  }

  batch.update(userRef, scheduleUpdate);
  await batch.commit();

  return { success: true as const };
}

function persistRoutine(batch: ReturnType<typeof writeBatch>, userId: string, routine: Routine) {
  if (!routine.id.startsWith("temp-")) {
    return doc(db, "users", userId, "routines", routine.id);
  }

  const finalExercises: RoutinesExercise[] = routine.exercises.map((ex) => {
    if (ex.id.startsWith("temp-")) {
      const newExerciseRef = doc(collection(db, "users", userId, "exercises"));

      batch.set(newExerciseRef, {
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        description: ex.description ?? "",
        imageUrl: null,
        createdAt: serverTimestamp(),
      });

      return { exerciseId: newExerciseRef.id, name: ex.name, muscleGroup: ex.muscleGroup, isCustom: true };
    }

    return { exerciseId: ex.id, name: ex.name, muscleGroup: ex.muscleGroup, isCustom: ex.isCustom };
  });

  const newRoutineRef = doc(collection(db, "users", userId, "routines"));

  const exerciseRefs = finalExercises.map((exercise) =>
    exercise.isCustom ? doc(db, "users", userId, "exercises", exercise.exerciseId) : doc(db, "exercises", exercise.exerciseId)
  );

  batch.set(newRoutineRef, {
    name: routine.name,
    color: routine.color,
    exercises: exerciseRefs,
    createdAt: serverTimestamp(),
  });

  return newRoutineRef;
}

export async function editUserSchedule(
  userId: string,
  data: {
    dayIndex: number;
    routineIds: string[];
  }
) {
  const userRef = doc(db, "users", userId);
  const dayKey = weekDays[data.dayIndex];

  const newDaySchedule = data.routineIds.map((routine) =>
    doc(db, "users", userId, "routines", routine)
  );

  await updateDoc(userRef, {
    [`schedule.${dayKey}`]: newDaySchedule,
  });
}