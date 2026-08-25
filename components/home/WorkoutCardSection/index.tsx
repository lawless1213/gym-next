"use client";

import ActionCard from "@/components/shared/cards/ActionCard";
import { WorkoutCard } from "@/components/shared/cards/WorkoutCard";
import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useSchedule } from "@/hooks/useServices/useSchedule";
import { getNextPendingRoutine } from "@/lib/services/schedule";
import { Routine } from "@/types";
import { IconUser } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function WorkoutCardSection() {
  const t = useTranslations("home");
  const [nextRoutine, setNextRoutine] = useState<Routine | null>(null);
  const { user, loading: isUserLoading } = useAuth();
  const userId = user?.uid;

  const { data: scheduleMap, isLoading: isLoading } = useSchedule(userId);
  const isLoadingPendingRoutine = isUserLoading || isLoading || (!!userId && !scheduleMap);

  useEffect(() => {
    if (!userId || !scheduleMap) {
      setNextRoutine(null);
      return;
    }
    const routine = getNextPendingRoutine(scheduleMap);
    setNextRoutine(routine);
  }, [userId, scheduleMap]);
  

  return (
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
          <ActionCard title={t("workoutCard.empty")} />
        )
      ) : (
        <ActionCard
          title={t("workoutCard.notAuth")}
          icon={IconUser}
          onClick={() => open("auth")}
        />
      )}
    </SkeletonSwitcher>
  );
}
