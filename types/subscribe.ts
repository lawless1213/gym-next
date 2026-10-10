import { type Icon as TablerIcon } from "@tabler/icons-react";

export type PlanId = "monthly" | "yearly" | "lifetime";

export type Plan = {
  id: PlanId;
  price: number;
};

export type Feature = {
  icon: TablerIcon;
  title: string;
  description: string;
  free: boolean;
};

export type SubscriptionStatus = "none" | "trialing" | "active" | "past_due" | "canceled";

/** Shape of `users/{uid}.subscribed`. Written only by the server (Admin SDK). */
export type Subscription = {
  plan: PlanId | null;
  status: SubscriptionStatus;
  /** Epoch ms; null for lifetime or no subscription. Stored as a Firestore Timestamp. */
  expiresAt: number | null;
  freeAiTries: number;
};

/** What the UI reads: stored data + `isActive` derived by `isSubscriptionActive`. */
export type UserSubscription = Subscription & { isActive: boolean };
