"use client";

import { IconCarambolaFilled, IconChevronRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/providers/UserPreferencesProvider";
import { useRouter } from "next/navigation";

export default function SubscribeBanner() {
  const t = useTranslations("settings.subscribe");
  const { user } = useAuth();
  const { params } = useUserPreferences();
  const router = useRouter();

  if (!user || params.subscribed.isActive) {
    return null;
  }

  return (
    <div
      onClick={() => router.push("/settings?tab=subscribe")}
      className={
        "flex min-h-17 cursor-pointer items-center justify-between gap-x-2 gap-y-4 rounded-2xl bg-primary/10 p-4 text-primary duration-200 select-none hover:text-foreground max-sm:flex-col"
      }>
      <div className="flex flex-1 items-center gap-2 self-center">
        <IconCarambolaFilled className="shrink-0" />
        <div className="text-sm">
          <p className="font-bold">{t("title")}.</p>
          <p>{t("subtitle")}</p>
        </div>
        <IconChevronRight className="ml-auto shrink-0" />
      </div>
    </div>
  );
}
