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
    <div className="fixed inset-x-0 bottom-16 z-50 p-4 bg-card border-t border-border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground text-center sm:text-left">
        {t('text')}
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          onClick={() => handleConsent(false)}>
          {t('required')}
        </Button>
        <Button onClick={() => handleConsent(true)}>{t('all')}</Button>
      </div>
    </div>
  );
}
