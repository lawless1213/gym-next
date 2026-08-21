import { MUSCLE_GROUPS } from "@/data/exercise";

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