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
import { useRecords } from "./hooks/useServices/useRecords";
import { useHistory } from "./hooks/useServices/useHistory";
import { totalHistoryVolume } from "./lib/utils";

export default function Home() {
  const t = useTranslations("HomePage");
  const { open } = useModal();
  const { user, loading: isUserLoading } = useAuth();
  const [nextRoutine, setNextRoutine] = useState<Routine | null>(null);

  const userId = user?.uid;
  const { data: scheduleMap, isLoading: isLoadingDataPendingRoutine } = useSchedule(userId);

  const { data: lastWeekHistory = [], isLoading: isLoadingLastWeekHistory } = useHistory(userId, { period: "week" });
  const { data: prevWeekHistory = [], isLoading: isLoadingPrevWeekHistory} = useHistory(userId, { period: "prev-week" });
  
  const { data, isLoading: isLoadingRecords } = useRecords({userId, period: 'month'});
  const records = data ? Object.values(data) : [];
  

  const isLoadingPendingRoutine = isUserLoading || isLoadingDataPendingRoutine || (!!userId && !scheduleMap);
  useEffect(() => {
    if (!userId || !scheduleMap) {
      setNextRoutine(null);
      return;
    }
    const routine = getNextPendingRoutine(scheduleMap);
    setNextRoutine(routine);
  }, [userId, scheduleMap]);

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

      <MotivationalBanner records={records} lastWeekHistory={lastWeekHistory} prevWeekHistory={prevWeekHistory}/>
 

      <div className="grid grid-cols-3 gap-3">
        <QuickStat
          label="Workouts"
          value={history.length}
          sublabel="This month"
        />
        <QuickStat
          label="Volume"
          value={totalHistoryVolume(lastWeekHistory)}
          sublabel="kg lifted"
        />
        <QuickStat
          label="PRs"
          value={records.length}
          sublabel="This month"
        />
      </div>
    </div>
  );
}
