// Single source of truth for subscription state.
// Pure module: safe to import from client components and from server code.
import type { Subscription, UserSubscription } from "@/types/subscribe";
import { FREE_AI_TRIES, subscriptionSchema } from "@/lib/schemas/subscription.schema";

export const DEFAULT_SUBSCRIPTION: Subscription = {
  plan: null,
  status: "none",
  expiresAt: null,
  freeAiTries: FREE_AI_TRIES,
};

/** Normalizes raw Firestore data (missing fields, Timestamps, junk) into a valid Subscription. */
export function parseSubscription(raw: unknown): Subscription {
  if (raw == null || typeof raw !== "object") return { ...DEFAULT_SUBSCRIPTION, freeAiTries: 0 };
  return subscriptionSchema.parse(raw);
}

/** The only place that decides whether a subscription grants premium access. */
export function isSubscriptionActive(sub: Subscription, now: number = Date.now()): boolean {
  if (!sub.plan) return false;
  if (sub.status !== "active" && sub.status !== "trialing") return false;
  if (sub.plan === "lifetime") return true;
  return sub.expiresAt !== null && sub.expiresAt > now;
}

export function toUserSubscription(raw: unknown, now: number = Date.now()): UserSubscription {
  const sub = parseSubscription(raw);
  return { ...sub, isActive: isSubscriptionActive(sub, now) };
}
