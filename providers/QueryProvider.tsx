"use client";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState, useEffect, useRef } from "react";
import { get, set, del } from "idb-keyval";
import { useAuth } from "@/hooks/useAuth";
import { removeOtherUsersDrafts } from "@/lib/workoutStorage";
import { QUERY_CACHE_MAX_AGE_MS, QUERY_CACHE_SCHEMA_VERSION } from "@/lib/config/queryCache";

const PERSIST_KEY = "REACT_QUERY_OFFLINE_CACHE";

const idbPersister = {
  persistClient: async (client: unknown) => {
    await set(PERSIST_KEY, client);
  },
  restoreClient: async () => {
    try {
      const cache = await get(PERSIST_KEY);
      return cache ?? undefined;
    } catch {
      return undefined;
    }
  },
  removeClient: async () => {
    await del(PERSIST_KEY);
  },
};

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            // Must be >= maxAge of the persister, or queries are dropped before they are persisted.
            gcTime: QUERY_CACHE_MAX_AGE_MS,
            networkMode: "offlineFirst",
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  // Drop all cached (and persisted) data when the signed-in user changes: logout,
  // account deletion or switching accounts. Otherwise the next person on the same
  // device would see the previous user's data from the offline cache.
  const { user, loading } = useAuth();
  const previousUid = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (loading) return;
    const uid = user?.uid ?? null;
    if (previousUid.current && previousUid.current !== uid) {
      queryClient.clear();
      del(PERSIST_KEY).catch((error) => console.error("Failed to clear persisted query cache:", error));
      // Unfinished workout drafts are per user too. Pending (finished, unsynced) workouts are kept:
      // they are keyed by uid and re-sent when that user signs in again.
      removeOtherUsersDrafts(uid);
    }
    previousUid.current = uid;
  }, [user?.uid, loading, queryClient]);

  useEffect(() => {
    const handleOnline = () => {
      const images = document.querySelectorAll<HTMLImageElement>("img");

      images.forEach((img) => {
        if (!img.complete || img.naturalWidth === 0) {
          const currentSrc = img.src;
          const cleanSrc = currentSrc.split("&_retry=")[0];
          img.src = `${cleanSrc}${cleanSrc.includes("?") ? "&" : "?"}_retry=${Date.now()}`;
        }
      });
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: idbPersister,
        maxAge: QUERY_CACHE_MAX_AGE_MS,
        buster: `v${QUERY_CACHE_SCHEMA_VERSION}`,
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations();
        queryClient.invalidateQueries();
      }}>
      {children}
    </PersistQueryClientProvider>
  );
};
