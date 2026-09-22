"use client";

import { useTranslations } from "next-intl";
import { IconEdit } from "@tabler/icons-react";
import { useModal } from "@/components/modals/modal-store";
import ButtonAdd from "@/components/shared/ButtonAdd";
import { useRouter } from "next/navigation";
import { useUserPreferences } from "@/providers/user-preferences-provider";

export default function NewMeasurements() {
  const router = useRouter();
  const { params } = useUserPreferences();

  const t = useTranslations("stats");
  const { open } = useModal();

  return (
    <ButtonAdd
      onClick={() => (params.subscribe ? open("progress") : router.push("/settings?tab=subscribe"))}
      ariaLabel={t("progress.buttonAdd")}
      icon={<IconEdit className="size-6" />}
    />
  );
}
