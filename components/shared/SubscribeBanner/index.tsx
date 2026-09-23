"use client";

import { IconCarambolaFilled, IconChevronRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/providers/user-preferences-provider";
import { useRouter } from "next/navigation";

export default function SubscribeBanner() {
  const t = useTranslations("settings.subscribe");
  const { user } = useAuth();
  const { params } = useUserPreferences();
  const router = useRouter();

  // if (!user || !user.emailVerified || params.subscribed.isActive) {
  //   return null;
  // }

  return (
    <div
      onClick={() => router.push("/settings?tab=subscribe")}
      className={"flex gap-x-2 gap-y-4 p-4 min-h-17 items-center justify-between bg-primary/10 text-primary rounded-2xl duration-200 select-none max-sm:flex-col cursor-pointer hover:text-foreground"}>
      <div className="flex gap-2 self-center items-center flex-1">
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
