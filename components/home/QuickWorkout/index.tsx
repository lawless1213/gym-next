"use client";

import { useTranslations } from "next-intl";
import { IconBolt } from "@tabler/icons-react";
import ButtonAdd from "@/components/shared/ButtonAdd";
import { useStartQuickWorkout } from "@/hooks/useStartQuickWorkout";

export default function QuickWorkout() {
  const t = useTranslations("home");
  const startQuickWorkout = useStartQuickWorkout();

  return (
    <ButtonAdd
      onClick={() => startQuickWorkout()}
      ariaLabel={t("buttonAdd")}
      icon={<IconBolt className="size-6" />}
    />
  );
}
