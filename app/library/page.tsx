"use client";

import { useState } from "react";
import { IconBarbell, IconFolderOpen } from "@tabler/icons-react";
import Exercises from "./_components/exercises";
import Routines from "./_components/routines";
import { useTranslations } from "next-intl";
import { Header } from "../components/Header";
import { Tabs } from "../components/common/tabs";
import ButtonCreate from "./_components/buttonCreate";
import { useModal } from "../lib/modal/modal-store";
import { useAuth } from "../hooks/useAuth";

type LibraryTab = "exercise" | "routine";

export default function LibraryScreen() {
  const t = useTranslations("Library");
  const { user } = useAuth();
  const { open } = useModal();
  const [activeTab, setActiveTab] = useState<LibraryTab>("exercise");

  const tabItems = [
    {
      id: "exercise",
      label: t("tabs.exercises"),
      icon: <IconBarbell className="h-4 w-4" />,
    },
    {
      id: "routine",
      label: t("tabs.routines"),
      icon: <IconFolderOpen className="h-4 w-4" />,
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 pb-4">
        <Header
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Tabs
          items={tabItems}
          activeTab={activeTab}
          onChange={setActiveTab}>
          {activeTab === "exercise" ? <Exercises /> : <Routines />}
        </Tabs>
      </div>
      {user && <ButtonCreate onClick={() => open(activeTab)} />}
    </>
  );
}
