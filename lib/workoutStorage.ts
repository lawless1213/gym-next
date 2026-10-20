import { Timestamp } from "firebase/firestore";
import type { PersistReason, WorkoutSession } from "@/types";

/**
 * localStorage copies of workouts, keyed by user:
 * - draft   `workout-session-<uid>-<routineId | "quick">` — an unfinished workout to resume;
 * - pending `workout-pending-<uid>-<workoutId>` — a finished workout until the server confirms it.
 *   Firestore's own persistent queue normally delivers it; this copy is a fallback re-sent on
 *   app start / reconnect (see `usePendingWorkoutSync`), safe because the write is idempotent.
 */
const DRAFT_PREFIX = "workout-session-";
const PENDING_PREFIX = "workout-pending-";
/** Drafts older than this are dropped instead of offered for resume. */
export const DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export interface StoredDraft<T> {
  workout: T;
  elapsedTime: number;
  savedAt: number;
  reason: PersistReason;
}

export const draftKey = (userId: string, slot: string) => `${DRAFT_PREFIX}${userId}-${slot}`;
const pendingKey = (userId: string, workoutId: string) => `${PENDING_PREFIX}${userId}-${workoutId}`;

/**
 * `JSON.stringify` turns a Firestore Timestamp into `{ seconds, nanoseconds, type: "firestore/timestamp/1.0" }`
 * (via `Timestamp.toJSON`; older SDKs omit `type`). Turn those back into Timestamps, otherwise the
 * workout is saved with a map in `startedAt` and drops out of history queries.
 */
export function isSerializedTimestamp(value: unknown): value is { seconds: number; nanoseconds: number } {
  if (!value || typeof value !== "object") return false;
  const { seconds, nanoseconds, type, ...rest } = value as Record<string, unknown>;
  return (
    typeof seconds === "number" &&
    typeof nanoseconds === "number" &&
    (type === undefined || (typeof type === "string" && type.startsWith("firestore/timestamp/"))) &&
    Object.keys(rest).length === 0
  );
}

function reviveTimestamps(_key: string, value: unknown) {
  return isSerializedTimestamp(value) ? new Timestamp(value.seconds, value.nanoseconds) : value;
}

function parse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw, reviveTimestamps) as T;
  } catch {
    return null;
  }
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

const read = <T>(key: string): T | null => parse<T>(readRaw(key));

/** Fired on draft writes/removals in this tab (the `storage` event only covers other tabs). */
const DRAFT_CHANGE_EVENT = "workout-draft-change";
const notifyDraftChange = () => window.dispatchEvent(new Event(DRAFT_CHANGE_EVENT));

/** For `useSyncExternalStore`: subscribe to draft changes in this and other tabs. */
export function subscribeDrafts(onChange: () => void) {
  window.addEventListener(DRAFT_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(DRAFT_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Raw draft string (stable snapshot for `useSyncExternalStore`), parse it with `parseDraft`. */
export const readDraftRaw = (key: string) => readRaw(key);

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to write workout to localStorage:", error);
  }
}

function remove(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage unavailable (private mode etc.) — nothing to remove.
  }
}

function keysWithPrefix(prefix: string): string[] {
  try {
    return Object.keys(window.localStorage).filter((key) => key.startsWith(prefix));
  } catch {
    return [];
  }
}

/** Parses a stored draft; `null` if missing, malformed or older than `DRAFT_MAX_AGE_MS`. No side effects. */
export function parseDraft<T extends { exercises: unknown[] }>(raw: string | null): StoredDraft<T> | null {
  const draft = parse<StoredDraft<T>>(raw);
  if (!draft || !Array.isArray(draft.workout?.exercises) || typeof draft.savedAt !== "number") return null;
  if (Date.now() - draft.savedAt > DRAFT_MAX_AGE_MS) return null;
  return draft;
}

export function readDraft<T extends { exercises: unknown[] }>(key: string): StoredDraft<T> | null {
  if (typeof window === "undefined") return null;
  const draft = parseDraft<T>(readRaw(key));
  if (!draft) remove(key); // drop stale or malformed drafts
  return draft;
}

export function writeDraft<T>(key: string, draft: StoredDraft<T>) {
  write(key, draft);
  notifyDraftChange();
}

export function removeDraft(key: string) {
  remove(key);
  notifyDraftChange();
}

/** Removes drafts of every user except `keepUserId` (called when the signed-in user changes). */
export function removeOtherUsersDrafts(keepUserId: string | null) {
  for (const key of keysWithPrefix(DRAFT_PREFIX)) {
    if (!keepUserId || !key.startsWith(`${DRAFT_PREFIX}${keepUserId}-`)) remove(key);
  }
  notifyDraftChange();
}

export const savePendingWorkout = (userId: string, workout: WorkoutSession) =>
  write(pendingKey(userId, workout.id), workout);
export const removePendingWorkout = (userId: string, workoutId: string) => remove(pendingKey(userId, workoutId));

export function readPendingWorkouts(userId: string): WorkoutSession[] {
  return keysWithPrefix(`${PENDING_PREFIX}${userId}-`)
    .map((key) => read<WorkoutSession>(key))
    .filter((workout): workout is WorkoutSession => !!workout && typeof workout.id === "string");
}
