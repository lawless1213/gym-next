"use client";

import { useState} from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { Tabs } from "@/components/ui/Tabs";
import CommonExercises from "./common/commonExercises";
import CustomExercises from "./custom/customExercises";

type ExerciseTab = "common" | "custom";

export default function Exercises() {
  const t = useTranslations("library");

  const tabItems = [
    {
      id: "common",
      label: t("tabs.commonExercises"),
    },
    {
      id: "routine",
      label: t("tabs.customExercises"),
    },
  ];
  const [activeTab, setActiveTab] = useState<ExerciseTab>("common");

  const { user } = useAuth();

  return user ? (
    <Tabs
      items={tabItems}
      activeTab={activeTab}
      onChange={setActiveTab}>
      {activeTab === "common" ? <CommonExercises /> : <CustomExercises />}
    </Tabs>
  ) : (
    <CommonExercises />
  );
}
