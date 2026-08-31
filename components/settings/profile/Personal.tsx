"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { IconEdit } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function Personal() {
  const t = useTranslations("settings.profile.personal");

  const { user } = useAuth();
  const userId = user?.uid;

  const editHandler = () => {};

  return (
    <div className="flex justify-start w-full items-center gap-4 max-sm:flex-col max-sm:text-center">
      <div className="shrink-0 size-30 bg-primary rounded-[100%]"></div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span>Andrew Lotoskiy</span>
          <Button
            size="icon-sm"
            variant="outline"
            onClick={editHandler}>
            <IconEdit className="size-5" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">180cm</div>
      </div>
    </div>
  );
}
