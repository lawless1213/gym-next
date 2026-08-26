"use client";

import { IconDownload, IconX } from "@tabler/icons-react";
import { useInstallPrompt } from "./useInstallPrompt";

export default function InstallBanner() {
  const { visible, ios, install, dismiss } = useInstallPrompt();

  if (!visible) return null;

  return (
    <div className="flex items-center gap-3 border-b border-border bg-card/95 px-4 py-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lime-300">
        <IconDownload className="size-6" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          Встанови застосунок
        </p>
        <p className="truncate text-xs text-neutral-400">
          {ios
            ? "Натисни «Поділитися» → «На екран Домівки»"
            : "Швидший доступ і робота офлайн"}
        </p>
      </div>

      {!ios && (
        <button
          onClick={install}
          className="shrink-0 rounded-lg bg-lime-300 px-3 py-1.5 text-xs font-medium text-neutral-900 active:scale-95"
        >
          Встановити
        </button>
      )}

      <button
        onClick={dismiss}
        aria-label="Закрити"
        className="shrink-0 p-1 text-neutral-400 active:scale-95"
      >
        <IconX className="size-6" />
      </button>
    </div>
  );
}