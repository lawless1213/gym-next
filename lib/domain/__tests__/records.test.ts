import { describe, expect, it } from "vitest";
import { isNewPersonalRecord } from "../records";

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
