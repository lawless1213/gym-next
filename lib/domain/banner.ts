// Pure state selection for the home motivational banner (no Firebase, no UI).
// One banner, one state at a time, picked by priority: record → up → down → first → empty.

export type BannerRecord = { weight: number; prevWeight?: number; reps: number };

export type BannerInput<R extends BannerRecord> = {
  /** Workouts of the last 7 days. */
  thisWeek: { volume?: number }[];
  /** Workouts of the 7 days before that. */
  prevWeek: { volume?: number }[];
  /** Personal records set in the last 7 days. */
  records: R[];
};

export type BannerVolume = {
  thisVolume: number;
  prevVolume: number;
  workouts: number;
  prevWorkouts: number;
  records: number;
};

export type BannerState<R extends BannerRecord> =
  | ({ kind: "record"; record: R; gain: number | null; otherRecords: number } & BannerVolume)
  | ({ kind: "up"; percent: number } & BannerVolume)
  | ({ kind: "down"; workoutsToCatchUp: number } & BannerVolume)
  | ({ kind: "first" } & BannerVolume)
  | ({ kind: "empty" } & BannerVolume);

const sumVolume = (workouts: { volume?: number }[]) => workouts.reduce((total, w) => total + (w.volume ?? 0), 0);

/** The record to celebrate: biggest weight gain over the previous best, else the heaviest. */
export function pickHighlightRecord<R extends BannerRecord>(records: R[]): R | null {
  if (records.length === 0) return null;
  // Records without a previous best (first time on an exercise) rank after any real gain.
  const gain = (r: R) => (r.prevWeight != null ? r.weight - r.prevWeight : -Infinity);
  return records.reduce((best, r) => {
    if (gain(r) !== gain(best)) return gain(r) > gain(best) ? r : best;
    return r.weight > best.weight ? r : best;
  });
}

export function getBannerState<R extends BannerRecord>({
  thisWeek,
  prevWeek,
  records,
}: BannerInput<R>): BannerState<R> {
  const thisVolume = sumVolume(thisWeek);
  const prevVolume = sumVolume(prevWeek);
  const base: BannerVolume = {
    thisVolume,
    prevVolume,
    workouts: thisWeek.length,
    prevWorkouts: prevWeek.length,
    records: records.length,
  };

  if (thisWeek.length === 0) return { kind: "empty", ...base };

  const record = pickHighlightRecord(records);
  if (record) {
    const gain =
      record.prevWeight != null && record.weight > record.prevWeight ? record.weight - record.prevWeight : null;
    return { kind: "record", record, gain, otherRecords: records.length - 1, ...base };
  }

  if (prevVolume <= 0) return { kind: "first", ...base };

  if (thisVolume >= prevVolume) {
    return { kind: "up", percent: Math.round(((thisVolume - prevVolume) / prevVolume) * 100), ...base };
  }

  // How many average workouts (this week's average) cover the gap; at least one.
  const average = thisVolume / thisWeek.length;
  const workoutsToCatchUp = average > 0 ? Math.max(1, Math.ceil((prevVolume - thisVolume) / average)) : 1;
  return { kind: "down", workoutsToCatchUp, ...base };
}

/** Stable pick of a copy variant for the day, so the text doesn't change between renders. */
export function dailyVariant(count: number, now: Date = new Date()): number {
  const dayIndex = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000);
  return ((dayIndex % count) + count) % count;
}
