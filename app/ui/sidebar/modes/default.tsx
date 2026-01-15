"use client";

import { usePathname } from "next/navigation";
import { IconLogin, IconLogout } from "@tabler/icons-react";
import { AsideLink } from "../asideLink";
import { navLinks } from "@/app/data/navManu";
import { AsideButton } from "../asideButton";
import { useAuth } from "@/app/hooks/useAuth";

export function DefaultAside() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
                label: link.label,
                link: link.link,
                active: pathname === link.link,
                icon: (<link.icon size={20} />) as React.ReactNode,
              }}
            />
          ))}
        {user ? (
          <AsideButton
            button={{
              label: "Logout",
              onClick: logout,
              icon: <IconLogout size={20} />,
            }}
          />
        ) : (
          <AsideLink
            link={{
              active: false,
              label: "Login",
              link: "/login",
              icon: <IconLogin size={20} />,
            }}
          />
        )}
      </div>
    </>
  );
}
