"use client";

import { LOCALES } from "@/app/lib/i18n/locales";
import { Button } from "../../buttons/button";
import { AsideButton } from "../asideButton";

export function LanguageAside() {
  const langButtonHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    console.log("lang");
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        {LOCALES.map((locale) => (
          <AsideButton key={locale}
            button={{
              label: locale,
							shortLabel: locale,
              onClick: langButtonHandler,
            }}
          />
        ))}
      </div>
    </>
  );
}
