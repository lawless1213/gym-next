import { z } from "zod";

export const FREE_AI_TRIES = 5;

/** Accepts a Firestore Timestamp (client or admin), a number or a Date; returns epoch ms. */
const epochMs = z.preprocess((value) => {
  if (value == null) return null;
  if (typeof value === "number") return value;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") {
    return value.toMillis();
  }
  return null;
}, z.number().nullable());

/** Tolerates values hand-edited in the Firebase console: " Active " -> "active". */
const normalizedString = (value: unknown) => (typeof value === "string" ? value.trim().toLowerCase() : value);

export const subscriptionSchema = z.object({
  plan: z.preprocess(normalizedString, z.enum(["monthly", "yearly", "lifetime"]).nullable()).catch(null),
  status: z.preprocess(normalizedString, z.enum(["none", "trialing", "active", "past_due", "canceled"])).catch("none"),
  expiresAt: epochMs.catch(null),
  freeAiTries: z.number().int().min(0).catch(0),
});
