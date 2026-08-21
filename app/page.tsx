"use client";

import { useTranslations } from "next-intl";
import QuickStat from "@/components/ui/quickStat";
import { WeeklyCalendar } from "@/components/shared/WeeklyCalendar";
import { MotivationalBanner } from "@/components/home/MotivationalBanner";
import { Header } from "@/components/shared/Header";
import { useAuth } from "@/hooks/useAuth";
import { IconBolt } from "@tabler/icons-react";
import { useModal } from "@/components/modals/modal-store";
import { useRecords } from "../hooks/useServices/useRecords";
import { useHistory } from "../hooks/useServices/useHistory";
import { totalHistoryVolume } from "../lib/utils";
import ButtonAdd from "../components/shared/ButtonAdd";
import { WorkoutCardSection } from "@/components/home/WorkoutCardSection";
import QuickStats from "@/components/home/QuickStats";
import QuickWorkout from "@/components/home/QuickWorkout";
import MuscleSchema from "@/components/shared/MuscleSchema";

export default function Home() {
  const t = useTranslations("HomePage");
  const { user } = useAuth();

  const userId = user?.uid;

  const { data: lastWeekHistory = [], isLoading: isLoadingLastWeekHistory } = useHistory(userId, { period: "week" });
  const { data: prevWeekHistory = [], isLoading: isLoadingPrevWeekHistory } = useHistory(userId, { period: "prev-week" });

  const { data: dataRecords, isLoading: isLoadingRecords } = useRecords({ userId, period: "week" });
  const lastWeekRecords = dataRecords ? Object.values(dataRecords) : [];

  return (
    <>
      <div className="flex flex-col gap-4 pb-4">
        <Header
          title={t(`header.welcome.${user ? "auth" : "unauth"}`)}
          subtitle={user && user.displayName ? t("header.user", { user: user.displayName }) : t("header.guest")}
        />
        <WeeklyCalendar />
        <WorkoutCardSection />
        <MotivationalBanner
          records={lastWeekRecords}
          lastWeekHistory={lastWeekHistory}
          prevWeekHistory={prevWeekHistory}
        />
        <QuickStats lastWeekHistory={lastWeekHistory} lastWeekRecords={lastWeekRecords} isLoading={isLoadingPrevWeekHistory || isLoadingRecords}/>
        <QuickWorkout/>
        <MuscleSchema/>
      </div>
    </>
  );
}
