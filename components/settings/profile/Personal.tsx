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
    <div className="flex justify-start w-full items-center gap-4 p-6 bg-secondary rounded-2xl">
      <div className="shrink-0 size-25 max-sm:size-15 bg-primary/60 rounded-[100%] flex items-center justify-center">
				<span className="text-white font-bold text-2xl tracking-widest">AL</span>
			</div>
      <div className="flex-1">
        <div className="text-xl font-bold">Andrew Lotoskiy</div>
        <div className="text-sm">180cm</div>
      </div>
      <Button
        size="icon-xl"
        variant="outline"
        onClick={editHandler}>
        <IconEdit className="size-5" />
      </Button>
    </div>
  );
}
