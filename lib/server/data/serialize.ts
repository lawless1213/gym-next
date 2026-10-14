import "server-only";
import { DocumentReference, Timestamp } from "firebase-admin/firestore";

/**
 * Converts Admin SDK values into plain JSON-safe data so they can cross the
 * server action boundary: Timestamp -> epoch ms, DocumentReference -> path.
 */
export function toPlain<T = unknown>(value: unknown): T {
  if (value instanceof Timestamp) return value.toMillis() as T;
  if (value instanceof DocumentReference) return value.path as T;
  if (Array.isArray(value)) return value.map((v) => toPlain(v)) as T;
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toPlain(v)])) as T;
  }
  return value as T;
}
