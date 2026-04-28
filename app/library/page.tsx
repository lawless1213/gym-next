"use client";

import { useState } from "react";
import { IconBarbell, IconFolderOpen } from "@tabler/icons-react";
import Exercises from "./_components/exercises";
import Routines from "./_components/routines";
import { useTranslations } from "next-intl";
import { Header } from "../components/Header";
import { Tabs } from "../components/common/tabs";

type LibraryTab = "exercises" | "routines";

export default function LibraryScreen() {
  const t = useTranslations("Library");
  const [activeTab, setActiveTab] = useState<LibraryTab>("exercises");

  const tabItems = [
    {
      id: "exercises",
      label: t("tabs.exercises"),
      icon: <IconBarbell className="h-4 w-4" />,
    },
    {
      id: "routines",
      label: t("tabs.routines"),
      icon: <IconFolderOpen className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 pb-4">
      <Header
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <Tabs
        items={tabItems}
        activeTab={activeTab}
        onChange={setActiveTab}>
        {activeTab === "exercises" ? <Exercises /> : <Routines />}
      </Tabs>
    </div>
  );
}
