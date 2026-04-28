"use client";

import { useState } from "react";
import { IconTrophy, IconActivity } from "@tabler/icons-react";
import { cn } from "@/app/lib/utils";

import { Header } from "../components/Header";
import { useTranslations } from "next-intl";
import Progress from "./_components/progress";
import Records from "./_components/records";
import { Tabs } from "../components/common/tabs";

type StatsTab = "progress" | "records";

export default function Stats() {
  const t = useTranslations("stats");
  const [activeTab, setActiveTab] = useState<StatsTab>("progress");

  const tabItems = [
    {
      id: "progress",
      label: t("tabs.progress"),
      icon: <IconActivity className="h-4 w-4" />,
    },
    {
      id: "records",
      label: t("tabs.records"),
      icon: <IconTrophy className="h-4 w-4" />,
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
        {activeTab === "progress" ? <Progress /> : <Records />}
      </Tabs>
    </div>
  );
}
