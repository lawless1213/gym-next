import { describe, expect, it } from "vitest";
import { Timestamp } from "firebase/firestore";
import { isSerializedTimestamp } from "../workoutStorage";

describe("isSerializedTimestamp", () => {
  it("recognizes Timestamp.toJSON output (with and without type)", () => {
    const json = JSON.parse(JSON.stringify(Timestamp.fromMillis(1_792_576_800_000)));
    expect(json.type).toMatch(/^firestore\/timestamp\//);
    expect(isSerializedTimestamp(json)).toBe(true);
    expect(isSerializedTimestamp({ seconds: 1, nanoseconds: 0 })).toBe(true);
  });

  it("ignores other objects", () => {
    expect(isSerializedTimestamp({ seconds: 1, nanoseconds: 0, extra: true })).toBe(false);
    expect(isSerializedTimestamp({ seconds: "1", nanoseconds: 0 })).toBe(false);
    expect(isSerializedTimestamp({ weight: 20, reps: 5 })).toBe(false);
    expect(isSerializedTimestamp(null)).toBe(false);
  });
});
