"use client";

import { QueryClient } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  Persister,
  PersistedClient,
} from "@tanstack/react-query-persist-client";
import { useState, useEffect } from "react";
import { get, set, del } from "idb-keyval";

const idbPersister: Persister = {
  persistClient: async (client: PersistedClient) => {
    await set("REACT_QUERY_OFFLINE_CACHE", client);
  },
  restoreClient: async () => {
    try {
      const cache = await get<PersistedClient>("REACT_QUERY_OFFLINE_CACHE");
      return cache ?? undefined;
    } catch {
      return undefined;
    }
  },
  removeClient: async () => {
    await del("REACT_QUERY_OFFLINE_CACHE");
  },
};

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 60 * 24 * 7,
            networkMode: "offlineFirst",
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

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
        maxAge: 1000 * 60 * 60 * 24 * 7,
        buster: "v1",
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            if (query.state.status !== "success") return false;

            const data = query.state.data;
            if (data && typeof data === "object") {
              if ("logger" in data || "container" in data) {
                return false;
              }
            }

            const key = query.queryKey[0];
            if (typeof key === "string" && (key.includes("logger") || key.includes("platform"))) {
              return false;
            }

            return true;
          },
        },
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations();
        queryClient.invalidateQueries();
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};