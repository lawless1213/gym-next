"use client";

import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@/app/lib/i18n/i18n-action";
import { IconUser, IconLogout, IconMoon, IconSun, IconAi } from "@tabler/icons-react";
import { useAuth } from "@/app/hooks/useAuth";
import { useAppTheme } from "@/app/hooks/useAppTheme";
import { useModal } from "@/app/lib/modal/modal-store";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/__components/common/tooltip";

type HeaderProps = {
  title: string;
  subtitle: string;
};

export function Header(props: HeaderProps) {
  const t = useTranslations("components.header")
  const tNotification = useTranslations("notification");
  const { open } = useModal();
  const locale = useLocale();
  const { user, logout, loading } = useAuth();
  const { mounted, isDark, toggleTheme } = useAppTheme();
  const [pendingLocaleChange, setPendingLocaleChange] = useState(false);

  const langButtonHandler = (): React.MouseEventHandler<HTMLButtonElement> => {
    return () => {
      const newLocale = locale === "uk" ? "en" : "uk";
      setUserLocale(newLocale);
      setPendingLocaleChange(true);
    };
  };

  useEffect(() => {
    if (pendingLocaleChange) {
      toast.info(tNotification("language.successChange"));
      setPendingLocaleChange(false);
    }
  }, [locale]);

  return (
    <header className="flex items-center justify-between gap-2">
      <div className="space-y-1">
        <h1 className="text-md font-bold text-foreground sm:text-2xl">{props.subtitle}</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">{props.title}</p>
      </div>
      <div className="flex gap-1">
        {user && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => open("ai")}
                className="group flex size-10 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
                <IconAi className="size-10 text-muted-foreground group-hover:text-primary transition-[0.2s]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t("ai")}</TooltipContent>
          </Tooltip>
        )}

        {mounted && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className="group flex size-10 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
                {isDark ? <IconSun className="size-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" /> : <IconMoon className="size-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{isDark ? t("lightTheme") :t("darkTheme")}</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={langButtonHandler()}
              className="group flex size-10 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
              <span className="text-xs text-muted-foreground group-hover:text-primary transition-[0.2s]">{(locale === "uk" ? "en" : "uk").toUpperCase()}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{t("changeLang")}</TooltipContent>
        </Tooltip>

        {user ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={logout}
                className="group flex size-10 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
                <IconLogout className="size-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t("logout")}</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => open("auth")}
                className="group flex size-10 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
                <IconUser className="size-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t("login")}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </header>
  );
}
