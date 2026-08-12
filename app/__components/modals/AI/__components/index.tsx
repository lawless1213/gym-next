"use client";

import { useState } from "react";
import { AiExerciseContent } from "../__components/exercise";
import { IconBarbell, IconCalendarBolt, IconTreadmill } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Tabs } from "../../../../../components/ui/Tabs";
import { AiRoutineContent } from "../__components/routine";
import { AiScheduleContent } from "../__components/schedule";

type AiTab = "exercise" | "routine" | "schedule";

export function AiGeneration() {
  const t = useTranslations("ai.modal");
  const [activeTab, setActiveTab] = useState<AiTab>("exercise");

  const tabItems = [
    {
      id: "exercise",
      label: t("tabs.exercise"),
      icon: <IconBarbell className="size-4" />,
      title: t("title"),
    },
    {
      id: "routine",
      label: t("tabs.routine"),
      icon: <IconTreadmill className="size-4" />,
      title: t("title"),
    },
    {
      id: "schedule",
      label: t("tabs.schedule"),
      icon: <IconCalendarBolt className="size-4" />,
      title: t("title"),
    },
  ];

  const content: Record<AiTab, React.ReactNode> = {
    exercise: <AiExerciseContent />,
    routine: <AiRoutineContent />,
    schedule: <AiScheduleContent />,
  };

  return (
    <Tabs
      items={tabItems}
      activeTab={activeTab}
      onChange={setActiveTab}>
      {content[activeTab]}
    </Tabs>
  );
}
