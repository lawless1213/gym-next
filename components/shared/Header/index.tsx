"use client";

import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@/i18n/i18n-action";
import { IconUser, IconLogout, IconMoon, IconSun, IconAi, IconSettings } from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useModal } from  "@/components/modals/modal-store";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { Button } from "@/components/ui/Button";

type HeaderProps = {
  page: string;
};

export function Header({ page }: HeaderProps) {
  const t = useTranslations("components.header");
  const tPages = useTranslations();
  const tNotification = useTranslations("notification");
  const { open } = useModal();
  const locale = useLocale();
  const { user, logout } = useAuth();
  const { mounted, isDark, toggleTheme } = useAppTheme();
  const [pendingLocaleChange, setPendingLocaleChange] = useState(false);

  const title = page === "home" ? (user && user.displayName ? tPages("home.header.user", { user: user.displayName }) : t("header.guest")) : tPages(`${page}.title`);
  const subtitle = page === "home" ? (tPages(`home.header.welcome.${user ? "auth" : "unauth"}`)) : tPages(`${page}.subtitle`);

  const handleLanguageChange = () => {
    const newLocale = locale === "uk" ? "en" : "uk";
    setUserLocale(newLocale);
    setPendingLocaleChange(true);
  };

  useEffect(() => {
    if (pendingLocaleChange) {
      toast.info(tNotification("language.successChange"));
      setPendingLocaleChange(false);
    }
  }, [locale, pendingLocaleChange, tNotification]);

  const actions = [
    {
      id: "theme",
      show: mounted,
      onClick: toggleTheme,
      tooltip: isDark ? t("lightTheme") : t("darkTheme"),
      icon: isDark ? (
        <IconSun className="size-5" />
      ) : (
        <IconMoon className="size-5" />
      ),
    },
    {
      id: "lang",
      show: true,
      onClick: handleLanguageChange,
      tooltip: t("changeLang"),
      icon: (
        <span className="text-sm font-bold">
          {(locale === "uk" ? "en" : "uk").toUpperCase()}
        </span>
      ),
    },
    {
      id: "settings",
      show: !!user,
      onClick: toggleTheme,
      tooltip: t("settings"),
      icon: <IconSettings className="size-5" />,
    },
    {
      id: "auth",
      show: true,
      onClick: user ? logout : () => open("auth"),
      tooltip: user ? t("logout") : t("login"),
      icon: user ? (
        <IconLogout className="size-5" />
      ) : (
        <IconUser className="size-5" />
      ),
    },
  ];

  return (
    <header className="flex items-center justify-between gap-2 sticky top-0 z-30 border-b border-border bg-card/95 p-4">
      <div className="space-y-1">
        <h1 className="text-md font-bold text-foreground sm:text-2xl">{title}</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
      </div>

      <div className="flex gap-1">
        {actions
          .filter((action) => action.show)
          .map((action) => (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <Button size="icon-lg" variant="outline" onClick={action.onClick}>
                  {action.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{action.tooltip}</TooltipContent>
            </Tooltip>
          ))}
      </div>
    </header>
  );
}