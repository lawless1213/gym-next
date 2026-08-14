"use client";

import { IconCalendarWeekFilled, IconTrendingUp } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import { WorkoutSession } from "@/types";

interface WeekStatsProps {
	history: WorkoutSession[];
	loading: boolean;
}

export default function WeekStats({history, loading} :WeekStatsProps) {
  const t = useTranslations("History");

  const weeklyVolume = history.reduce((total, workout) => total + (workout.volume ?? 0), 0);

  return (
    <div className="grid grid-cols-2 gap-3">
      <SkeletonSwitcher
        isLoading={loading}
        skeleton={
          <SkeletonBone
            br={12}
            height={104}
          />
        }>
        <div className="rounded-xl bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendarWeekFilled className="h-4 w-4" />
            <span className="text-sm">{t("summary.exercises")}</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{history.length}</p>
          <p className="text-xs text-muted-foreground">{t("summary.textExercises")}</p>
        </div>
      </SkeletonSwitcher>
      <SkeletonSwitcher
        isLoading={loading}
        skeleton={
          <SkeletonBone
            br={12}
            height={104}
          />
        }>
        <div className="rounded-xl bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconTrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm">{t("summary.volume")}</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{weeklyVolume >= 1000 ? `${(weeklyVolume / 1000).toFixed(1)}K` : weeklyVolume}</p>
          <p className="text-xs text-muted-foreground">{t("summary.textVolume")}</p>
        </div>
      </SkeletonSwitcher>
    </div>
  );
}
