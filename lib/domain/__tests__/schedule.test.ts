import { describe, expect, it } from "vitest";
import type { Routine, ScheduleMap } from "@/types";
import { EMPTY_SCHEDULE, getNextPendingRoutine } from "../schedule";

const routine = (id: string, completed = false) =>
  ({ id, name: id, color: "#000", exercises: [], completed }) as Routine;
const schedule = (partial: Partial<ScheduleMap>): ScheduleMap => ({ ...EMPTY_SCHEDULE, ...partial });

const thursday = new Date(2026, 9, 15);

describe("getNextPendingRoutine", () => {
  it("returns today's routine as available", () => {
    const result = getNextPendingRoutine(schedule({ thu: [routine("legs")] }), thursday);
    expect(result?.id).toBe("legs");
    expect(result?.available).toBe(true);
  });

  it("skips completed routines and finds a later day (not available yet)", () => {
    const result = getNextPendingRoutine(schedule({ thu: [routine("legs", true)], sat: [routine("push")] }), thursday);
    expect(result?.id).toBe("push");
    expect(result?.available).toBe(false);
  });

  it("wraps around to the start of the week", () => {
    const result = getNextPendingRoutine(schedule({ mon: [routine("pull")] }), thursday);
    expect(result?.id).toBe("pull");
  });

  it("returns null when everything is done or empty", () => {
    expect(getNextPendingRoutine(EMPTY_SCHEDULE, thursday)).toBeNull();
    expect(getNextPendingRoutine(schedule({ fri: [routine("x", true)] }), thursday)).toBeNull();
  });

  it("does not mutate the schedule", () => {
    const map = schedule({ thu: [routine("legs")] });
    getNextPendingRoutine(map, thursday);
    expect(map.thu[0].available).toBeUndefined();
  });
});
