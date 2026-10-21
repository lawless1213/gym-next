import { describe, expect, it } from "vitest";
import { dailyVariant, getBannerState, pickHighlightRecord } from "../banner";

const w = (volume: number) => ({ volume });

describe("getBannerState", () => {
  it("is empty when there are no workouts this week", () => {
    expect(getBannerState({ thisWeek: [], prevWeek: [w(500)], records: [] }).kind).toBe("empty");
  });

  it("celebrates a record before anything else", () => {
    const state = getBannerState({
      thisWeek: [w(100)],
      prevWeek: [w(5000)],
      records: [{ weight: 100, prevWeight: 95, reps: 5 }],
    });
    expect(state).toMatchObject({ kind: "record", gain: 5, otherRecords: 0 });
  });

  it("is 'first' when there is nothing to compare with", () => {
    expect(getBannerState({ thisWeek: [w(300)], prevWeek: [], records: [] }).kind).toBe("first");
  });

  it("reports growth as a rounded percent", () => {
    expect(getBannerState({ thisWeek: [w(1180)], prevWeek: [w(1000)], records: [] })).toMatchObject({
      kind: "up",
      percent: 18,
    });
  });

  it("counts equal volume as growth (0%)", () => {
    expect(getBannerState({ thisWeek: [w(1000)], prevWeek: [w(1000)], records: [] })).toMatchObject({
      kind: "up",
      percent: 0,
    });
  });

  it("estimates workouts needed to catch up from this week's average", () => {
    const state = getBannerState({ thisWeek: [w(400), w(400)], prevWeek: [w(1600)], records: [] });
    expect(state).toMatchObject({ kind: "down", workoutsToCatchUp: 2 });
  });

  it("asks for at least one workout when this week's volume is zero", () => {
    const state = getBannerState({ thisWeek: [w(0)], prevWeek: [w(1000)], records: [] });
    expect(state).toMatchObject({ kind: "down", workoutsToCatchUp: 1 });
  });
});

describe("pickHighlightRecord", () => {
  it("prefers the biggest gain, then the heaviest", () => {
    const a = { weight: 100, prevWeight: 95, reps: 5 };
    const b = { weight: 60, prevWeight: 50, reps: 8 };
    const c = { weight: 140, reps: 3 };
    expect(pickHighlightRecord([a, b, c])).toBe(b);
    expect(pickHighlightRecord([c, { weight: 80, reps: 5 }])).toBe(c);
    expect(pickHighlightRecord([])).toBeNull();
  });
});

describe("dailyVariant", () => {
  it("is stable within a day and in range", () => {
    const morning = new Date(2026, 9, 22, 8);
    const evening = new Date(2026, 9, 22, 22);
    expect(dailyVariant(3, morning)).toBe(dailyVariant(3, evening));
    expect(dailyVariant(3, morning)).toBeGreaterThanOrEqual(0);
    expect(dailyVariant(3, morning)).toBeLessThan(3);
  });
});
