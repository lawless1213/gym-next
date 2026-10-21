/**
 * Error codes returned by AI server actions (lib/server/actions/ai/*, lib/server/ai/*).
 * The server never returns human text: the client translates codes via `ai.errors.<CODE>`
 * in messages/*.json (see useAiErrorMessage).
 */
export const AI_ERROR_CODES = [
  "INVALID_SESSION", // ID token missing/expired — sign in again
  "INVALID_REQUEST", // input failed zod validation (never charged)
  "NO_FREE_TRIES", // free user used all tries
  "AI_DAILY_LIMIT", // premium daily limit reached
  "AI_OVERLOADED", // Gemini 429
  "AI_UNAVAILABLE", // model not found / service auth error
  "AI_EMPTY_RESPONSE",
  "AI_INVALID_RESPONSE", // not JSON, wrong shape, or nothing usable after mapping
  "AI_NOT_UNIQUE", // generated exercise already exists
  "AI_FAILED", // anything else
] as const;

export type AiErrorCode = (typeof AI_ERROR_CODES)[number];

export type AiFailure = { success: false; error: AiErrorCode };

export function isAiErrorCode(value: unknown): value is AiErrorCode {
  return typeof value === "string" && (AI_ERROR_CODES as readonly string[]).includes(value);
}
