"use client";

import { IconCalendarWeekFilled, IconTrendingUp } from "@tabler/icons-react";
import { useAuth } from "@/app/hooks/useAuth";
import { useTranslations } from "next-intl";
import WorkoutSession from "./_components/workoutSession";
import { Header } from "../__components/Header";
import { useHistory } from "../hooks/useServices/useHistory";
import SkeletonSwitcher from "../__components/common/SkeletonSwitcher";
import SkeletonBone from "../__components/common/skeletonBone";

export default function History() {
  const t = useTranslations("History");
  const tMonth = useTranslations("components.month");

  const { user, loading: isUserLoading } = useAuth();
  const userId = user?.uid;

  const { data: history = [], isLoading: isDataLoading } = useHistory(userId, { period: "week" });
  const isLoading = isUserLoading || isDataLoading || (!!userId && !history);

  const weeklyVolume = history.reduce((total, workout) => total + (workout.volume ?? 0), 0);

  const HistorySkeleton = (
    <div className="space-y-3 w-full">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonBone
          key={i}
          br={12}
          height={80}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 pb-4">
      <Header
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="grid grid-cols-2 gap-3">
        <SkeletonSwitcher
          isLoading={isLoading}
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
          isLoading={isLoading}
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

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">{t("list.recentTitle")}</h2>
        <SkeletonSwitcher
          isLoading={isLoading}
          skeleton={HistorySkeleton}>
          {history.map((workout) => (
            <WorkoutSession
              key={workout.id}
              {...workout}
            />
          ))}
        </SkeletonSwitcher>
      </div>
    </div>
  );
}
