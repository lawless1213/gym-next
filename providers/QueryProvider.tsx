"use client";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState, useEffect } from "react";
import { get, set, del } from "idb-keyval";

const idbPersister = {
  persistClient: async (client: unknown) => {
    await set("REACT_QUERY_OFFLINE_CACHE", client);
  },
  restoreClient: async () => {
    try {
      const cache = await get("REACT_QUERY_OFFLINE_CACHE");
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