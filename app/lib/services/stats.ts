import {  doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import { BodyProgress, Measurement } from "@/app/types";

type RawMeasurement = { date: Timestamp; value: number };

function mapMeasurements(measurements: RawMeasurement[], limit: number): Measurement[] {
  return measurements
    .sort((a, b) => b.date.seconds - a.date.seconds)
    .slice(0, limit)
    .map((m) => ({ value: m.value, date: m.date.toDate() }))
    .reverse();
}

export async function getUserLastProgress(
  userId: string,
  amount: number = 10
): Promise<BodyProgress> {
  const progressRef = doc(db, 'users', userId, 'stats', 'progress');
  const snap = await getDoc(progressRef);
  const raw = snap.data() as Record<string, RawMeasurement[]>;

  return {
    arms:    mapMeasurements(raw.arms ?? [], amount),
    chest:   mapMeasurements(raw.chest ?? [], amount),
    thighs:  mapMeasurements(raw.thighs ?? [], amount),
    waist:   mapMeasurements(raw.waist ?? [], amount),
    weight:  mapMeasurements(raw.weight ?? [], amount),
  };
}


export async function getUserProgressForPeriod(
  userId: string,
  fromDate: Date,
  toDate: Date
): Promise<BodyProgress> {
  
  
  const progress = {
		arms: [],
		chest: [],
		thighs: [],
		waist: [],
		weight: [],
	};

	return progress;
}
