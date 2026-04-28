"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import QuickStat from "@/app/components/common/quickStat";
import { WeeklyCalendar } from "@/app/components/weeklyCalendar";
import { WorkoutCard } from "@/app/components/cards/workoutCard";
import { MotivationalBanner } from "@/app/components/motivationalBanner";
import { Header } from "@/app/components/Header";
import { useAuth } from "@/app/hooks/useAuth";
import { getNextPendingRoutine } from "@/app/lib/services/schedule";
import { Routine } from "@/app/types";
import { useSchedule } from "@/app/hooks/useServices/useSchedule";
import SkeletonBone from "./components/common/skeletonBone";
import SkeletonSwitcher from "./components/common/SkeletonSwitcher";

export default function Home() {
  const t = useTranslations("HomePage");
  const { user, loading: isUserLoading } = useAuth();
  const [nextRoutine, setNextRoutine] = useState<Routine | null>(null);

  const userID = user?.uid;
  const { data: scheduleMap, isLoading: isLoadingDataPendingRoutine } = useSchedule(userID);

  const isLoadingPendingRoutine = isUserLoading || isLoadingDataPendingRoutine || (!!userID && !scheduleMap);
  useEffect(() => {
    if (!userID || !scheduleMap) {
      setNextRoutine(null);
      return;
    }
    const routine = getNextPendingRoutine(scheduleMap);
    setNextRoutine(routine);
  }, [userID, scheduleMap]);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <Header
        title={t(`header.welcome.${user ? "auth" : "unauth"}`)}
        subtitle={user && user.displayName ? t("header.user", { user: user.displayName }) : t("header.guest")}
      />

      <WeeklyCalendar />

      <SkeletonSwitcher
        isLoading={isLoadingPendingRoutine}
        skeleton={
          <SkeletonBone
            br={16}
            height={180}
          />
        }>
        {nextRoutine ? <WorkoutCard routine={nextRoutine} /> : <div className="rounded-2xl bg-card p-4 text-sm text-muted-foreground text-center min-h-[180px] flex items-center justify-center">No upcoming workouts for this week.</div>}
      </SkeletonSwitcher>
      
      <MotivationalBanner />

      <div className="grid grid-cols-3 gap-3">
        <QuickStat
          label="Workouts"
          value="47"
          sublabel="This month"
        />
        <QuickStat
          label="Volume"
          value="52K"
          sublabel="kg lifted"
        />
        <QuickStat
          label="PRs"
          value="8"
          sublabel="This month"
        />
      </div>
    </div>
  );
}
