"use client";

import { IconDownload, IconX } from "@tabler/icons-react";
import { useInstallPrompt } from "./useInstallPrompt";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export default function InstallBanner() {
  const t = useTranslations("components.InstallBanner");
  const { visible, ios, install, dismiss } = useInstallPrompt();

  if (!visible) return null;
  return (
    <div className="flex items-center gap-3 border-b border-border bg-card/95 px-4 py-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <IconDownload className="size-6" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{t("title")}</p>
        <p className="truncate text-xs text-neutral-400">{ios ? t("descriptionIOS") : t("description")}</p>
      </div>

      {!ios && <Button onClick={install} >{t("install")}</Button>}

      <Button
        variant="outline"
        size="icon"
        onClick={dismiss}
        aria-label="Закрити"
      >
        <IconX className="size-6" />
      </Button>
    </div>
  );
}