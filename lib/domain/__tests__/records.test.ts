import { describe, expect, it } from "vitest";
import { bestSetsByExercise, isNewPersonalRecord } from "../records";

describe("isNewPersonalRecord", () => {
  it("first result is always a record", () => {
    expect(isNewPersonalRecord({ weight: 20, reps: 5 }, null)).toBe(true);
    expect(isNewPersonalRecord({ weight: 20, reps: 5 }, undefined)).toBe(true);
  });

  it("heavier weight wins regardless of reps", () => {
    expect(isNewPersonalRecord({ weight: 82.5, reps: 1 }, { weight: 80, reps: 10 })).toBe(true);
  });

  it("same weight needs more reps", () => {
    expect(isNewPersonalRecord({ weight: 80, reps: 9 }, { weight: 80, reps: 8 })).toBe(true);
    expect(isNewPersonalRecord({ weight: 80, reps: 8 }, { weight: 80, reps: 8 })).toBe(false);
  });

  it("lighter weight is never a record", () => {
    expect(isNewPersonalRecord({ weight: 70, reps: 20 }, { weight: 80, reps: 5 })).toBe(false);
  });
});

describe("bestSetsByExercise", () => {
  const set = (weight: number, reps: number, completed = true) => ({ weight, reps, completed });

  it("picks the heaviest completed set, more reps on a tie", () => {
    const result = bestSetsByExercise([{ id: "a", sets: [set(60, 8), set(70, 5), set(70, 6), set(100, 1, false)] }]);
    expect(result.map((r) => [r.exercise.id, r.best])).toEqual([["a", { weight: 70, reps: 6 }]]);
  });

  it("skips quick exercises and exercises without completed sets", () => {
    const result = bestSetsByExercise([
      { id: "quick", isQuick: true, sets: [set(50, 5)] },
      { id: "none", sets: [set(50, 5, false)] },
      { id: "ok", sets: [set(20, 10)] },
    ]);
    expect(result.map((r) => r.exercise.id)).toEqual(["ok"]);
  });
});
