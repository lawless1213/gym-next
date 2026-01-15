"use client";

import { usePathname } from "next/navigation";
import { IconLogin, IconLogout, IconLanguage } from "@tabler/icons-react";
import { AsideLink } from "./asideLink";
import { navLinks } from "@/app/data/navManu";
import { AsideButton } from "./asideButton";
import { useAuth } from "@/app/hooks/useAuth";
import { LOCALES } from "@/app/lib/i18n/locales";
import { useState } from "react";
import { DefaultAside } from "./modes/default";
import { LanguageAside } from "./modes/language";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [languageMode, setLanguageMode] = useState(false);

  const asideModeHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setLanguageMode(!languageMode);
  };

  return (
    <aside className=" flex flex-col justify-between border-r-2 border-panel p-4 sticky left-0 top-0 h-screen">
      {
        languageMode ?
        <LanguageAside/> :
        <DefaultAside/>
      }
  
      <div className="flex flex-col gap-1">
        <AsideButton
          button={{
            label: "Language",
            onClick: asideModeHandler,
            icon: <IconLanguage size={20} />,
          }}
        />
      </div>
    </aside>
  );
}
