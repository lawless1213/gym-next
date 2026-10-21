/**
 * Version of the data shape kept in the persisted React Query cache (IndexedDB, see QueryProvider).
 * Bump it whenever cached data or query keys change shape (service return types, `lib/queryKeys.ts`,
 * Firestore document structure). A different version drops the old cache on the next start instead of
 * rendering stale shapes.
 *
 * Deliberately NOT tied to the build id: that would wipe the offline cache on every deploy.
 *
 * History: 2 — initial persisted cache; 3 — query key factory (commonExercises, history/records/progress keys).
 */
export const QUERY_CACHE_SCHEMA_VERSION = 3;

/** How long the persisted cache is trusted at all. */
export const QUERY_CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;
