"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import QuickStat from "@/components/ui/quickStat";
import { WeeklyCalendar } from "@/components/shared/WeeklyCalendar";
import { WorkoutCard } from "@/components/home/WorkoutCard";
import { MotivationalBanner } from "@/components/home/MotivationalBanner";
import { Header } from "@/components/shared/Header";
import { useAuth } from "@/app/hooks/useAuth";
import { getNextPendingRoutine } from "@/lib/services/schedule";
import { Routine } from "@/types";
import { useSchedule } from "@/app/hooks/useServices/useSchedule";
import SkeletonBone from "../components/ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "../components/ui/Skeleton/SkeletonSwitcher";
import ActionCard from "../components/shared/cards/ActionCard";
import { IconUser, IconBolt } from "@tabler/icons-react";
import { useModal } from "@/components/modals/modal-store";
import { useRecords } from "./hooks/useServices/useRecords";
import { useHistory } from "./hooks/useServices/useHistory";
import { totalHistoryVolume } from "../lib/utils";
import ButtonAdd from "../components/shared/ButtonAdd";

export default function Home() {
  const t = useTranslations("HomePage");
  const tQuickWorkout = useTranslations("workout.confirmQuickStart");
  const { open, confirm } = useModal();
  const { user, loading: isUserLoading } = useAuth();
  const [nextRoutine, setNextRoutine] = useState<Routine | null>(null);

  const userId = user?.uid;
  const { data: scheduleMap, isLoading: isLoadingDataPendingRoutine } = useSchedule(userId);

  const { data: lastWeekHistory = [], isLoading: isLoadingLastWeekHistory } = useHistory(userId, { period: "week" });
  const { data: prevWeekHistory = [], isLoading: isLoadingPrevWeekHistory } = useHistory(userId, { period: "prev-week" });

  const { data: dataRecords, isLoading: isLoadingRecords } = useRecords({ userId, period: "week" });
  const lastWeekRecords = dataRecords ? Object.values(dataRecords) : [];

  const isLoadingPendingRoutine = isUserLoading || isLoadingDataPendingRoutine || (!!userId && !scheduleMap);
  useEffect(() => {
    if (!userId || !scheduleMap) {
      setNextRoutine(null);
      return;
    }
    const routine = getNextPendingRoutine(scheduleMap);
    setNextRoutine(routine);
  }, [userId, scheduleMap]);

  const quickWorkoutConfirm = async () => {
    try {
      if (!user) throw new Error("Not authenticated");
      
      const ok = await confirm({
        title: tQuickWorkout("title")
      });

      if (ok) {
        open('quickWorkout')
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <>
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
              <ActionCard title={t('workoutCard.empty')} />
            )
          ) : (
            <ActionCard
              title={t("workoutCard.notAuth")}
              icon={IconUser}
              onClick={() => open("auth")}
            />
          )}
        </SkeletonSwitcher>

        <MotivationalBanner
          records={lastWeekRecords}
          lastWeekHistory={lastWeekHistory}
          prevWeekHistory={prevWeekHistory}
        />

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
      </div>
      <ButtonAdd
        onClick={() => quickWorkoutConfirm()}
        ariaLabel={t('buttonAdd')}
        icon= { <IconBolt className="size-6" /> }
      />
    </>
  );
}
