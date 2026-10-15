import { describe, expect, it } from "vitest";
import { isSubscriptionActive, parseSubscription, toUserSubscription } from "../subscription";

const NOW = Date.UTC(2026, 9, 15);
const DAY = 24 * 60 * 60 * 1000;

describe("parseSubscription", () => {
  it("missing data -> no plan, no free tries", () => {
    expect(parseSubscription(undefined)).toEqual({ plan: null, status: "none", expiresAt: null, freeAiTries: 0 });
  });

  it("normalizes hand-edited values and Timestamps", () => {
    const ts = { toMillis: () => NOW + DAY };
    expect(parseSubscription({ plan: " Yearly", status: "active ", expiresAt: ts, freeAiTries: 3 })).toEqual({
      plan: "yearly",
      status: "active",
      expiresAt: NOW + DAY,
      freeAiTries: 3,
    });
  });

  it("junk falls back to safe defaults", () => {
    expect(parseSubscription({ plan: "gold", status: 1, expiresAt: "", freeAiTries: -5 })).toEqual({
      plan: null,
      status: "none",
      expiresAt: null,
      freeAiTries: 0,
    });
  });
});

describe("isSubscriptionActive", () => {
  const base = { freeAiTries: 0 } as const;

  it("lifetime is active without expiry", () => {
    expect(isSubscriptionActive({ ...base, plan: "lifetime", status: "active", expiresAt: null }, NOW)).toBe(true);
  });

  it("monthly/yearly need a future expiresAt", () => {
    expect(isSubscriptionActive({ ...base, plan: "monthly", status: "active", expiresAt: NOW + DAY }, NOW)).toBe(true);
    expect(isSubscriptionActive({ ...base, plan: "monthly", status: "active", expiresAt: NOW - 1 }, NOW)).toBe(false);
    expect(isSubscriptionActive({ ...base, plan: "yearly", status: "active", expiresAt: null }, NOW)).toBe(false);
  });

  it("trialing counts as active, canceled/past_due/none do not", () => {
    expect(isSubscriptionActive({ ...base, plan: "yearly", status: "trialing", expiresAt: NOW + DAY }, NOW)).toBe(true);
    for (const status of ["canceled", "past_due", "none"] as const) {
      expect(isSubscriptionActive({ ...base, plan: "yearly", status, expiresAt: NOW + DAY }, NOW)).toBe(false);
    }
  });

  it("no plan is never active", () => {
    expect(isSubscriptionActive({ ...base, plan: null, status: "active", expiresAt: NOW + DAY }, NOW)).toBe(false);
  });
});

describe("toUserSubscription", () => {
  it("adds isActive computed by the same rule", () => {
    expect(toUserSubscription({ plan: "lifetime", status: "active" }, NOW).isActive).toBe(true);
    expect(toUserSubscription({ type: "lifetime" }, NOW).isActive).toBe(false); // legacy shape is not trusted
  });
});
