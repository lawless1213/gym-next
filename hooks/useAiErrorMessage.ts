"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

/**
 * Translates an AI error code (lib/errors/ai.ts, plus client codes like NO_TRAINING_DAYS)
 * into a message from `ai.errors`. Unknown codes fall back to AI_FAILED.
 */
export function useAiErrorMessage() {
  const t = useTranslations("ai.errors");
  return useCallback((code: unknown) => (typeof code === "string" && t.has(code) ? t(code) : t("AI_FAILED")), [t]);
}
