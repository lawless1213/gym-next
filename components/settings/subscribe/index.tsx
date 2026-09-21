import { IconCrown } from "@tabler/icons-react";
import Plans from "./Plans";
import Features from "./Features";
import { useTranslations } from "next-intl";

export default function Subscribe() {
  const t = useTranslations("settings.subscribe");

  return (
    <div className="pb-6">
      <header className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <IconCrown
            className="size-6"
            aria-hidden
          />
        </span>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
      </header>
      <Plans />
      <Features />
    </div>
  );
}
