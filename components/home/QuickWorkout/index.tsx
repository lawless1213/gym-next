"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { IconBolt } from "@tabler/icons-react";
import { useModal } from "@/components/modals/modal-store";
import ButtonAdd from "@/components/shared/ButtonAdd";

export default function QuickWorkout() {
  const t = useTranslations("HomePage");
  const tQuickWorkout = useTranslations("workout.confirmQuickStart");
  const { open, confirm } = useModal();
  const { user } = useAuth();

  const quickWorkoutConfirm = async () => {
    try {
      if (!user) throw new Error("Not authenticated");

      const ok = await confirm({
        title: tQuickWorkout("title"),
      });

      if (ok) {
        open("quickWorkout");
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
      <ButtonAdd
        onClick={() => quickWorkoutConfirm()}
        ariaLabel={t("buttonAdd")}
        icon={<IconBolt className="size-6" />}
      />
  );
}
