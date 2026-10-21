"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "@/components/modals/ModalProvider";

/** Confirm, then open the quick-workout modal. Guests get the login modal instead. */
export function useStartQuickWorkout() {
  const t = useTranslations("workout.confirmQuickStart");
  const { open, confirm } = useModal();
  const { user } = useAuth();

  return async () => {
    if (!user) {
      open("auth");
      return;
    }
    const ok = await confirm({ title: t("title") });
    if (ok) open("quickWorkout");
  };
}
