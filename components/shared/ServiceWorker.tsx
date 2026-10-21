"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/monitoring";

/**
 * Registers public/sw.js (built by `serwist build`, see serwist.config.js) in production.
 * Registered by hand instead of SerwistProvider to keep control over behaviour: no reload when the
 * device comes back online (it would interrupt a workout; Firestore re-syncs by itself).
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch((error) => reportError(error, "Service worker registration failed"));
  }, []);

  return null;
}
