"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import QuickStat from "@/app/__components/common/quickStat";
import { WeeklyCalendar } from "@/app/__components/weeklyCalendar";
import { WorkoutCard } from "@/app/__components/cards/workoutCard";
import { MotivationalBanner } from "@/app/__components/motivationalBanner";
import { Header } from "@/app/__components/Header";
import { useAuth } from "@/app/hooks/useAuth";
import { getNextPendingRoutine } from "@/app/lib/services/schedule";
import { Routine } from "@/app/types";
import { useSchedule } from "@/app/hooks/useServices/useSchedule";
import SkeletonBone from "./__components/common/skeletonBone";
import SkeletonSwitcher from "./__components/common/SkeletonSwitcher";
import ActionCard from "./__components/cards/action";
import { IconUser } from "@tabler/icons-react";
import { useModal } from "./lib/modal/modal-store";
import { useRecordsThisWeek } from "./hooks/useServices/useRecords";

export default function Home() {
  const t = useTranslations("HomePage");
  const { open } = useModal();
  const { user, loading: isUserLoading } = useAuth();
  const [nextRoutine, setNextRoutine] = useState<Routine | null>(null);

  const userID = user?.uid;
  const { data: scheduleMap, isLoading: isLoadingDataPendingRoutine } = useSchedule(userID);

  const { data, isLoading: loading } = useRecordsThisWeek(userID);
  const records = data ? Object.values(data) : [];
  

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
            height={72}
          />
        }>
        {user ? (
          nextRoutine ? (
            <WorkoutCard routine={nextRoutine} />
          ) : (
            <ActionCard title="No upcoming workouts for this week." />
          )
        ) : (
          <ActionCard
            title={t("workout.next.not-auth")}
            icon={IconUser}
            onClick={() => open("auth")}
          />
        )}
      </SkeletonSwitcher>

      <MotivationalBanner records={records} />
 

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
