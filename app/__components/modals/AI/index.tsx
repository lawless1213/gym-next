"use client";

import { useState } from "react";
import { ModalWrapper } from "../modal-wrapper";
import { AiExerciseContent } from "./__components/exercise";
import { IconBarbell, IconCalendarBolt, IconTreadmill } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Tabs } from "../../common/tabs";
import { AiRoutineContent } from "./__components/routine";
import { AiScheduleContent } from "./__components/schedule";

type AiTab = "exercise" | "routine" | "schedule";


interface WorkoutGenerationParams {
  goal: "muscle-gain" | "fat-loss" | "strength" | "endurance";
  level: "beginner" | "intermediate" | "advanced";
  daysPerWeek: number;
  equipment: "gym" | "home-dumbbells" | "bodyweight-only";
  focusAreas?: string[];
}


export function AiModal() {
  const t = useTranslations("ai.modal");
	const [activeTab, setActiveTab] = useState<AiTab>("exercise");

	const tabItems = [
    {
      id: "exercise",
      label: t("tabs.exercise"),
      icon: <IconBarbell className="size-4" />,
    },
    {
      id: "routine",
      label: t("tabs.routine"),
      icon: <IconTreadmill className="size-4" />,
    },
		{
      id: "schedule",
      label: t("tabs.schedule"),
      icon: <IconCalendarBolt className="size-4" />,
    },
  ];

	const content: Record<AiTab, React.ReactNode> = {
		exercise: <AiExerciseContent />,
		routine: <AiRoutineContent />,
		schedule: <AiScheduleContent />,
	};

  return (
    <ModalWrapper
      modalType="ai"
			size="large"
      title={"AI генерація"}>
      <div className="flex flex-col gap-4">
				<Tabs
          items={tabItems}
          activeTab={activeTab}
          onChange={setActiveTab}>
          	{content[activeTab]}
        </Tabs>
      </div>
    </ModalWrapper>
  );
}
