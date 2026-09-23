"use client";

import { useTranslations } from "next-intl";
import { WeeklyCalendar } from "@/components/shared/WeeklyCalendar";
import { MotivationalBanner } from "@/components/home/MotivationalBanner";
import { useAuth } from "@/hooks/useAuth";
import { useRecords } from "../hooks/useServices/useRecords";
import { useHistory } from "../hooks/useServices/useHistory";
import { WorkoutCardSection } from "@/components/home/WorkoutCardSection";
import QuickStats from "@/components/home/QuickStats";
import QuickWorkout from "@/components/home/QuickWorkout";
import ConfirmEmail from "../components/shared/ConfirmEmail";
import SubscribeBanner from "@/components/shared/SubscribeBanner";

export default function Home() {
  const t = useTranslations("home");
  const { user } = useAuth();

  const userId = user?.uid;

  const { data: lastWeekHistory = [], isLoading: isLoadingLastWeekHistory } = useHistory(userId, { period: "week" });
  const { data: prevWeekHistory = [], isLoading: isLoadingPrevWeekHistory } = useHistory(userId, { period: "prev-week" });

  const { data: dataRecords, isLoading: isLoadingRecords } = useRecords({ userId, period: "week" });
  const lastWeekRecords = dataRecords ? Object.values(dataRecords) : [];

  return (
    <div className="flex flex-col gap-4 pb-4">
      <WeeklyCalendar />
      <WorkoutCardSection />
      <ConfirmEmail />
      <SubscribeBanner />
      <MotivationalBanner
        records={lastWeekRecords}
        lastWeekHistory={lastWeekHistory}
        prevWeekHistory={prevWeekHistory}
      />
      <QuickStats
        lastWeekHistory={lastWeekHistory}
        lastWeekRecords={lastWeekRecords}
        isLoading={isLoadingPrevWeekHistory || isLoadingRecords}
      />
      <QuickWorkout />
    </div>
  );
}
