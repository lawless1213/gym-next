"use client";

import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@/app/lib/i18n/i18n-action";
import { IconUser, IconLogout, IconMoon, IconSun } from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { useAppTheme } from "@/app/hooks/useAppTheme";


export function HomeHeader() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const { user, logout } = useAuth();
  const { mounted, isDark, toggleTheme } = useAppTheme();


  const langButtonHandler = (): React.MouseEventHandler<HTMLButtonElement> => {
    return (event) => {
      setUserLocale(locale === "uk" ? "en" : "uk");
    };
  };

  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{t(`header.welcome.${user ? "auth" : "unauth"}`)}</p>
        <h1 className="text-2xl font-bold text-foreground">{user ? user.displayName : t("header.guest")}</h1>
      </div>
      <div className="flex gap-1">
        {mounted && <button
          onClick={toggleTheme}
          className="group flex h-10 w-10 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
          {
            isDark ? 
            <IconSun className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />
            :
            <IconMoon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />
          }
        </button>}
        <button
          onClick={langButtonHandler()}
          className="group flex h-10 w-10 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
          <span className="text-xs text-muted-foreground group-hover:text-primary transition-[0.2s]">{(locale === "uk" ? "en" : "uk").toUpperCase()}</span>
        </button>
        {user ? (
          <button
            onClick={logout}
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
            <IconLogout className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />
          </button>
        ) : (
          <Link
            href="/login"
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
            <IconUser className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />
          </Link>
        )}
      </div>
    </header>
  );
}
