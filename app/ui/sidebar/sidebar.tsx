"use client";

import { usePathname } from 'next/navigation'
import { IconLogin, IconLogout, IconLanguage } from "@tabler/icons-react";
import { AsideLink } from "./asideLink";
import { navLinks } from "@/app/data/navManu";
import { AsideButton } from "./asideButton";
import { useUser } from "@/app/hooks/useUser";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const languageButtonHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    console.log("language");
  };

  const loginButtonHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    console.log("login");
  };

  return (
    <aside className=" flex flex-col justify-between border-r-2 border-panel p-4 sticky left-0 top-0 h-screen">
      <div className="flex flex-col gap-1">
        {navLinks.map((link) => (
          <AsideLink
            key={link.label}
            link={{
              label: link.label,
              link: link.link,
              active: pathname === link.link,
              icon: (<link.icon size={20} />) as React.ReactNode,
            }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <AsideButton
          button={{
            label: "Language",
            onClick: languageButtonHandler,
            icon: <IconLanguage size={20} />,
          }}
        />
        {user ? (
          <AsideButton
            button={{
              label: "Logout",
              onClick: loginButtonHandler,
              icon: <IconLogout size={20} />,
            }}
          />
        ) : (
          <AsideLink
            link={{
              active: false,
              label: 'Login',
              link: '/login',
              icon: <IconLogin size={20} />,
            }}
          />
        )}
      </div>
    </aside>
  );
}
