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
  const avatarUrl = user?.photoURL || params.avatarUrl;
  return (
    <div className="flex w-full items-center justify-start gap-4 rounded-2xl bg-secondary p-4">
      {avatarUrl ? (
        <div className="size-20 shrink-0 max-sm:size-15">
          <Image
            width={100}
            height={100}
            src={avatarUrl}
            alt={user?.displayName || "avatar"}
            className="h-full w-full rounded-sm object-contain"
          />
        </div>
      ) : (
        <div className="flex size-20 shrink-0 items-center justify-center rounded-[100%] bg-primary/60 max-sm:size-15">
          <span className="text-2xl font-bold tracking-widest text-white">
            {user?.displayName ? user?.displayName.slice(0, 1) : t("user").slice(0, 1)}
          </span>
        </div>
      )}

      <div className="flex-1">
        <div className="text-xl font-bold">{user?.displayName || t("user")}</div>
        {params.height && <div className="text-sm">{params.height + tMeasurement(params.distance)}</div>}
        {user?.email ? (
          <div className="text-sm text-muted-foreground">{user.email}</div>
        ) : (
          <div className="text-sm">t("emptyEmail")</div>
        )}
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
