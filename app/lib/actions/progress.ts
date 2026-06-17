import { db } from "@/app/lib/firebaseConfig";
import { updateDoc, doc, arrayUnion, Timestamp } from "firebase/firestore";

const PROGRESS_FIELDS = ["weight", "waist", "chest", "arms", "thighs"] as const;

export type ProgressField = (typeof PROGRESS_FIELDS)[number];

export type ProgressEntry = {
  date: Date;
  weight?: number;
  waist?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
};

export async function addUserProgress(userId: string, data: ProgressEntry) {
  const userRef = doc(db, "users", userId, "stats", "progress");
  const updates: Record<string, any> = {};
  const timestamp = Timestamp.fromDate(data.date);

  for (const field of PROGRESS_FIELDS) {
    if (data[field] !== undefined) {
      updates[field] = arrayUnion({ date: timestamp, value: data[field] });
    }
  }

  if (Object.keys(updates).length === 0) return;
	await updateDoc(userRef, updates);
}