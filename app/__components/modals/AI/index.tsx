"use client";

import { useState } from "react";
import { ModalWrapper } from "../modal-wrapper";
import { AiExerciseContent } from "./__components/exercise";
import { IconBarbell, IconCalendarBolt, IconPencil, IconTreadmill } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Tabs } from "../../common/tabs";
import { AiRoutineContent } from "./__components/routine";
import { AiScheduleContent } from "./__components/schedule";
import { AiChatContent } from "./__components/chat";
import { AiGeneration } from "./__components";

type AiTab = "generation" | "chat";

export function AiModal() {
  const t = useTranslations("ai.modal");
	const [activeTab, setActiveTab] = useState<AiTab>("chat");

	const tabItems = [
    {
      id: "chat",
      label: t("tabs.chat"),
      title: t("chat.title")
    },
    {
      id: "generation",
      label: t("tabs.generation"),
      title: t("title")
    },
  ];

	const content: Record<AiTab, React.ReactNode> = {
		generation: <AiGeneration />,
    chat: <AiChatContent/>
	};

  return (
    <ModalWrapper
      modalType="ai"
      size="high"
      title={tabItems.find(tab => tab.id === activeTab)?.title}
    >
      <div className="flex flex-1 flex-col gap-4">
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
