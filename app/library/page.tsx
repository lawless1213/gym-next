"use client";

import { useState } from "react";
import { IconBarbell, IconFolderOpen } from "@tabler/icons-react";
import Exercises from "@/components/library/exercises";
import Routines from "@/components/library/routines";
import { useTranslations } from "next-intl";
import { Header } from "@/components/shared/Header";
import { Tabs } from "@/components/ui/Tabs";
import { useModal } from "@/components/modals/modal-store";
import { useAuth } from "../../hooks/useAuth";

type LibraryTab = "exercise" | "routine";

export default function LibraryScreen() {
  const t = useTranslations("library");
  const [activeTab, setActiveTab] = useState<LibraryTab>("exercise");

  const tabItems = [
    {
      id: "exercise",
      label: t("tabs.exercises"),
      icon: <IconBarbell className="size-4" />,
    },
    {
      id: "routine",
      label: t("tabs.routines"),
      icon: <IconFolderOpen className="size-4" />,
    },
  ];

  return (
      <div className="flex flex-col gap-2 md:gap-4 pb-4">
        <Tabs
          items={tabItems}
          activeTab={activeTab}
          onChange={setActiveTab}>
          {activeTab === "exercise" ? <Exercises /> : <Routines />}
        </Tabs>
      </div>
  );
}
