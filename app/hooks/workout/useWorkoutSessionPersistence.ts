"use client";

import { PersistReason } from "@/app/types";
import { useEffect } from "react";

interface UseWorkoutSessionPersistenceOptions {
  persist: (reason: PersistReason) => void;
  isPaused: boolean;
  autosaveIntervalMs?: number;
}

export function useWorkoutSessionPersistence({
  persist,
  isPaused,
  autosaveIntervalMs = 30_000,
}: UseWorkoutSessionPersistenceOptions) {
  useEffect(() => {
    const handleBeforeUnload = () => persist("before-unload");
    const handlePageHide = () => persist("page-hide");
    const handleOffline = () => persist("network-offline");
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") persist("visibility-hidden");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [persist]);

  useEffect(() => {
    return () => persist("component-unmount");
  }, [persist]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => persist("periodic-autosave"), autosaveIntervalMs);
    return () => clearInterval(interval);
  }, [isPaused, persist, autosaveIntervalMs]);
}