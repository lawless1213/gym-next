import { db } from "@/app/lib/firebaseConfig";
import { weekDays } from "@/app/types";
import { updateDoc, doc} from "firebase/firestore";

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