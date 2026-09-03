"use client";

import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/form/select";
import { AppTheme, useAppTheme } from "@/hooks/useAppTheme";
import { useAuth } from "@/hooks/useAuth";
import { setUserLocale } from "@/i18n/i18n-action";
import { setUserParams } from "@/lib/actions/user";
import { useUserPreferences } from "@/providers/user-preferences-provider";
import { IconEdit } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Appearance() {
  const t = useTranslations("settings.preferences.appearance");
  const tComponents = useTranslations("components");
  const tNotification = useTranslations("notification");
  const { params, updateParam } = useUserPreferences();
  const { setTheme, theme } = useAppTheme();
  const [pendingLocaleChange, setPendingLocaleChange] = useState(false);
  const locale = useLocale();

  const { user } = useAuth();
  const userId = user?.uid;

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale !== "en" && newLocale !== "uk") return;

    try {
      await updateParam("language", newLocale);
      await setUserLocale(newLocale);
      setPendingLocaleChange(true);
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  useEffect(() => {
    if (pendingLocaleChange) {
      toast.info(tNotification("language.successChange"));
      setPendingLocaleChange(false);
    }
  }, [locale, pendingLocaleChange, tNotification]);

  return (
    <div className="w-full space-y-2">
      {/* Theme */}
      <div className="flex items-center gap-2 w-full justify-between">
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
      <div className="flex items-center gap-2 w-full justify-between">
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
