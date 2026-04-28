"use client";

import { LOCALES } from "@/app/lib/i18n/locales";
import { AsideButton } from "../asideButton";
import { IconLanguage } from "@tabler/icons-react";
import { setUserLocale } from "@/app/lib/i18n/i18n-action";
import { useLocale, useTranslations } from 'next-intl';

export function LanguageAside({ modeSwitcher }: { modeSwitcher: React.MouseEventHandler<HTMLButtonElement> }) {
	const locale = useLocale();
	const t = useTranslations('languages');
	
  const langButtonHandler = (lang: string): React.MouseEventHandler<HTMLButtonElement> => {
    return (event) => {
      setUserLocale(lang);
			modeSwitcher(event);
    };
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        {LOCALES.map((key) => (
          <AsideButton
            key={key}
            button={{
              label: t(key),
              shortLabel: key.toUpperCase(),
              onClick: langButtonHandler(key),
							active: locale === key
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <AsideButton
          button={{
            label: "Language",
            onClick: modeSwitcher,
            icon: <IconLanguage size={20} />,
          }}
        />
      </div>
    </>
  );
}
