import { MUSCLE_GROUPS } from "@/data/exercise";
import { LOCALES } from "@/i18n/locales";

export type Locale = (typeof LOCALES)[number];

export type LocalizedText = Partial<Record<Locale, string>>;

export function getLocalizedText(value: LocalizedText | string | undefined, locale: Locale = "uk"): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  return value[locale] ?? value.en ?? value.uk ?? Object.values(value)[0] ?? "";
}

export function toLocalizedText(value: string): LocalizedText {
  return Object.fromEntries(LOCALES.map((locale) => [locale, value])) as LocalizedText;
}

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export type Period = "week" | "month" | "all";

export type HistoryOptions =
  | { period: "week" | "prev-week" | "current-week" | "month" | "year"; limit?: number }
  | { amount: number };

export type PersistReason =
  | "modal-close"
  | "before-unload"
  | "page-hide"
  | "visibility-hidden"
  | "network-offline"
  | "component-unmount"
  | "periodic-autosave"
  | "sync-failed";

export type ChatRole = "user" | "model";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};