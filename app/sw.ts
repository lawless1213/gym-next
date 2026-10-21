// Service worker (Serwist). Built by `serwist build` into public/sw.js, registered by
// components/shared/ServiceWorker.tsx. Worker globals come from the "webworker" lib in tsconfig.
/// <reference types="@serwist/next/typings" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  CacheFirst,
  CacheableResponsePlugin,
  ExpirationPlugin,
  NetworkOnly,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";

// Replaced with the precache manifest at build time.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const THIRTY_DAYS = 30 * 24 * 60 * 60;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Firebase APIs (Firestore streams, Auth tokens, auth handler): never touch. Firestore has its own
    // offline cache (persistentLocalCache); a SW cache or timeout here would break its long-polling.
    {
      matcher: ({ url }) =>
        url.hostname !== "firebasestorage.googleapis.com" &&
        (url.hostname.endsWith(".googleapis.com") || url.hostname.endsWith(".firebaseapp.com")),
      handler: new NetworkOnly(),
    },
    // Optimized images.
    {
      matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname === "/_next/image",
      handler: new StaleWhileRevalidate({
        cacheName: "next-image-cache",
        plugins: [
          new ExpirationPlugin({ maxEntries: 300, maxAgeSeconds: THIRTY_DAYS }),
          new CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
      }),
    },
    // Exercise images and avatars from Firebase Storage (URLs carry a token, content never changes).
    {
      matcher: ({ url }) => url.hostname === "firebasestorage.googleapis.com",
      handler: new CacheFirst({
        cacheName: "firebase-storage-images",
        plugins: [
          new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: THIRTY_DAYS }),
          new CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
      }),
    },
    // Next.js defaults: app pages (network-first, so the app opens offline after a visit), JS/CSS, fonts...
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();
