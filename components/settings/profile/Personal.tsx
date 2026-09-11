"use client";

import { useModal } from "@/components/modals/modal-store";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/providers/user-preferences-provider";
import { IconEdit } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

export default function Personal() {
  const { params } = useUserPreferences();
  const { open } = useModal();
  const { user } = useAuth();
  const t = useTranslations("settings.profile.personal");
  const tMeasurement = useTranslations("components.measurement");

  return (
    <div className="flex justify-start w-full items-center gap-4 p-4 bg-secondary rounded-2xl">
      {params.avatarUrl ? (
        <div className="shrink-0 size-20 max-sm:size-15">
          <Image
            width={100}
            height={100}
            src={params.avatarUrl}
            alt={user?.displayName || "avatar"}
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <div className="shrink-0 size-20 max-sm:size-15 bg-primary/60 rounded-[100%] flex items-center justify-center">
          <span className="text-white font-bold text-2xl tracking-widest">{user?.displayName ? user?.displayName.slice(0, 1) : t("user").slice(0, 1)}</span>
        </div>
      )}

      <div className="flex-1">
        <div className="text-xl font-bold">{user?.displayName || t("user")}</div>
        <div className="text-sm">{params.height + tMeasurement(params.distance)}</div>
        {user?.displayName ? <div className="text-sm text-muted-foreground">{user.email}</div> : <div className="text-sm">t("emptyEmail")</div> }
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon-xl"
            variant="outline"
            onClick={() => open("userEdit")}>
            <IconEdit className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">{t("edit")}</TooltipContent>
      </Tooltip>
    </div>
  );
}
