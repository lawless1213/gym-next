import { describe, expect, it } from "vitest";
import { calculateWorkoutVolume, totalHistoryVolume } from "../volume";

describe("calculateWorkoutVolume", () => {
  it("sums reps × weight of completed sets only", () => {
    const workout = {
      exercises: [
        {
          sets: [
            { reps: 10, weight: 50, completed: true },
            { reps: 8, weight: 60, completed: true },
            { reps: 6, weight: 70, completed: false },
          ],
        },
        { sets: [{ reps: 12, weight: 0, completed: true }] },
      ],
    };
    expect(calculateWorkoutVolume(workout)).toBe(10 * 50 + 8 * 60);
  });

  it("is 0 for an empty workout", () => {
    expect(calculateWorkoutVolume({ exercises: [] })).toBe(0);
  });
});

describe("totalHistoryVolume", () => {
  it("treats missing volume as 0", () => {
    expect(totalHistoryVolume([{ volume: 100 }, {}, { volume: 50.5 }])).toBe(150.5);
  });
});
