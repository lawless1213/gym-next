"use client";

import { useTranslations } from "next-intl";
import QuickStat from "@/components/ui/quickStat";
import { totalHistoryVolume } from "@/lib/utils";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import { PersonalRecord, WorkoutSession } from "@/types";

type QuickStatsProps = {
	lastWeekHistory: WorkoutSession[];
	lastWeekRecords: PersonalRecord[];
	isLoading: boolean;
};

export default function QuickStats({lastWeekHistory, lastWeekRecords, isLoading}:QuickStatsProps) {
  const t = useTranslations("home");

  return (
    <SkeletonSwitcher
      isLoading={isLoading}
      skeleton={
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBone
              key={i}
              br={16}
              height={83}
            />
          ))}
        </div>
      }>
      <div className="grid grid-cols-3 gap-3">
        <QuickStat
          label={t("quickStats.workoutsLabel")}
          value={lastWeekHistory.length}
          sublabel={t("quickStats.thisWeek")}
        />
        <QuickStat
          label={t("quickStats.kgLabel")}
          value={totalHistoryVolume(lastWeekHistory)}
          sublabel={t("quickStats.thisWeek")}
        />
        <QuickStat
          label={t("quickStats.prsLabel")}
          value={lastWeekRecords.length}
          sublabel={t("quickStats.thisWeek")}
        />
      </div>
    </SkeletonSwitcher>
  );
}
