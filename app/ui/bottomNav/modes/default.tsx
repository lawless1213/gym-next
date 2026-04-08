"use client";

import { usePathname } from "next/navigation";
import { IconLogin, IconLogout } from "@tabler/icons-react";
import { AsideLink } from "../asideLink";
import { navLinks } from "@/app/data/navManu";
import { AsideButton } from "../asideButton";
import { useAuth } from "@/app/hooks/useAuth";
import { useLocale, useTranslations } from 'next-intl';


export function DefaultAside({ modeSwitcher }: { modeSwitcher: React.MouseEventHandler<HTMLButtonElement> }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <>
      <div className="flex flex-col gap-1">
        {navLinks
          .filter((navItem) => {
            return !navItem.loginRequired || user;
          })
          .map((link) => (
            <AsideLink
              key={link.label}
              link={{
                label: t(link.label),
                link: link.link,
                active: pathname === link.link,
                icon: (<link.icon size={20} />) as React.ReactNode,
              }}
            />
          ))}
      </div>
      <div className="flex flex-col gap-1">
        {user ? (
          <AsideButton
            button={{
              label: t("logout"),
              onClick: logout,
              icon: <IconLogout size={20} />,
            }}
          />
        ) : (
          <AsideLink
            link={{
              active: false,
              label: t("login"),
              link: "/login",
              icon: <IconLogin size={20} />,
            }}
          />
        )}
        <AsideButton
          button={{
            label: t("language"),
            shortLabel: locale.toUpperCase(),
            onClick: modeSwitcher,
          }}
        />
      </div>
    </>
  );
}
