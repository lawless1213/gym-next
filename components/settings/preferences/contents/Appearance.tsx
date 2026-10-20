"use client";

import { Select } from "@/components/ui/form/Select";
import { AppTheme, useAppTheme } from "@/hooks/useAppTheme";
import { setUserLocale } from "@/i18n/i18n-action";
import { useUserPreferences } from "@/providers/UserPreferencesProvider";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Appearance() {
  const t = useTranslations("settings.preferences.appearance");
  const tComponents = useTranslations("components");
  const tNotification = useTranslations("notification");
  const { updateParam } = useUserPreferences();
  const { setTheme, theme } = useAppTheme();
  // Locale we switched to; the toast is shown once it has actually been applied.
  const [requestedLocale, setRequestedLocale] = useState<string | null>(null);
  const locale = useLocale();

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale !== "en" && newLocale !== "uk") return;

    try {
      await updateParam("language", newLocale);
      await setUserLocale(newLocale);
      setRequestedLocale(newLocale);
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  useEffect(() => {
    if (requestedLocale && requestedLocale === locale) {
      toast.info(tNotification("language.successChange"));
    }
  }, [locale, requestedLocale, tNotification]);

  return (
    <div className="w-full space-y-2">
      {/* Theme */}
      <div className="flex w-full items-center justify-between gap-2">
        <span>{t("theme.title")}</span>
        <div className="flex items-center gap-2">
          <Select
            input={{
              id: "theme",
              searchable: false,
              value: theme,
              onChange: (value) => setTheme(value as AppTheme),
              options: ["light", "dark", "system"].map((opt) => ({ value: opt, label: tComponents(`themes.${opt}`) })),
            }}
          />
        </div>
      </div>

      {/* Language */}
      <div className="flex w-full items-center justify-between gap-2">
        <span>{t("language.title")}</span>
        <div className="flex items-center gap-2">
          <Select
            input={{
              id: "language",
              searchable: false,
              value: locale,
              onChange: handleLanguageChange,
              options: ["en", "uk"].map((opt) => ({ value: opt, label: tComponents(`languages.${opt}`) })),
            }}
          />
        </div>
      </div>
    </div>
  );
}
