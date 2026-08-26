"use client";

import { useEffect, useState } from "react";
import type { BeforeInstallPromptEvent } from "@/types";
import { dismissForDays, isDismissed, isIos, isStandalone } from "@/lib/utils";

interface UseInstallPromptResult {
  visible: boolean;
  ios: boolean;
  install: () => Promise<void>;
  dismiss: () => void;
}

export function useInstallPrompt(): UseInstallPromptResult {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (isDismissed()) return;

    if (isIos()) {
      setIos(true);
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    dismissForDays();
    setVisible(false);
  };

  return { visible, ios, install, dismiss };
}