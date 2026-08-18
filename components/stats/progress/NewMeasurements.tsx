"use client";

import { useTranslations } from "next-intl";
import { IconEdit } from "@tabler/icons-react";
import { useModal } from "@/components/modals/modal-store";
import ButtonAdd from "@/components/shared/ButtonAdd";

export default function NewMeasurements() {
  const t = useTranslations("stats");
  const { open } = useModal();

  return (
    <ButtonAdd
      onClick={() => open("progress")}
      ariaLabel={t("progress.buttonAdd")}
      icon={<IconEdit className="size-6" />}
    />
  );
}
