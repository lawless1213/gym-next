import { describe, expect, it } from "vitest";
import { getHistoryRange } from "../periods";

// Thursday 15 Oct 2026, 18:30 local time.
const now = new Date(2026, 9, 15, 18, 30);
const day = (y: number, m: number, d: number) => new Date(y, m, d);

describe("getHistoryRange", () => {
  it("week = last 7 days until now", () => {
    expect(getHistoryRange("week", now)).toEqual({ from: day(2026, 9, 8), to: now });
  });

  it("prev-week = the 7 days before that", () => {
    expect(getHistoryRange("prev-week", now)).toEqual({ from: day(2026, 9, 1), to: day(2026, 9, 8) });
  });

  it("current-week starts on Monday", () => {
    expect(getHistoryRange("current-week", now).from).toEqual(day(2026, 9, 12));
  });

  it("current-week on Sunday goes back to Monday, not forward", () => {
    const sunday = new Date(2026, 9, 18, 9, 0);
    expect(getHistoryRange("current-week", sunday).from).toEqual(day(2026, 9, 12));
  });

  it("current-week on Monday starts today", () => {
    const monday = new Date(2026, 9, 12, 7, 0);
    expect(getHistoryRange("current-week", monday).from).toEqual(day(2026, 9, 12));
  });

  it("month and year start at the first day", () => {
    expect(getHistoryRange("month", now).from).toEqual(day(2026, 9, 1));
    expect(getHistoryRange("year", now).from).toEqual(day(2026, 0, 1));
  });

  it("crosses month boundaries", () => {
    const early = new Date(2026, 10, 3, 12, 0); // Tue 3 Nov
    expect(getHistoryRange("week", early).from).toEqual(day(2026, 9, 27));
    expect(getHistoryRange("current-week", early).from).toEqual(day(2026, 10, 2));
  });
});
