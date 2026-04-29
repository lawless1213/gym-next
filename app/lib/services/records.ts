import {  doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import { RecordsMap } from "@/app/types";

export async function getUserRecords(
  userId: string
): Promise<RecordsMap> {
  const snap = await getDoc(doc(db, 'users', userId, 'stats', 'records'));
	const records = snap.data() as RecordsMap;
	
  return records;
}