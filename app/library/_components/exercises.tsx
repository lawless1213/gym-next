"use client";

import { useState} from "react";
import { useAuth } from "@/app/hooks/useAuth";
import Loader from "../../__components/common/loader";
import { useTranslations } from "next-intl";
import SkeletonBone from "@/app/__components/common/skeletonBone";
import { Tabs } from "@/app/__components/common/tabs";
import CommonExercises from "./commonExercises";
import CustomExercises from "./customExercises";

type ExerciseTab = "common" | "custom";

export default function Exercises() {
  const t = useTranslations("Library");

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
