"use client";

import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

const STORAGE_KEY = "cookie-consent";

export function CookieBanner() {
  const t = useTranslations("components.cookie.banner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted, decidedAt: new Date().toISOString() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 flex flex-col items-center justify-between gap-4 border-t border-border bg-card p-4 shadow-lg sm:flex-row">
      <p className="text-center text-sm text-muted-foreground sm:text-left">{t("text")}</p>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          onClick={() => handleConsent(false)}>
          {t("required")}
        </Button>
        <Button onClick={() => handleConsent(true)}>{t("all")}</Button>
      </div>
    </div>
  );
}
