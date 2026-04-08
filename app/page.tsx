"use client";

import { useTranslations } from "next-intl";
import QuickStat from "@/app/ui/common/quickStat";
import { WeeklyCalendar } from "@/app/ui/weeklyCalendar";
import { WorkoutCard } from "@/app/ui/cards/workoutCard";
import { routines } from "@/app/data/mock-data";
import { MotivationalBanner } from "@/app/ui/motivationalBanner";
import { HomeHeader } from "@/app/ui/homeHeader";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col gap-4 pb-4">
      <HomeHeader />

      {/* Weekly Calendar */}
      <WeeklyCalendar />

      {/* Next Workout Card */}
      <WorkoutCard routine={routines[0]} />

      {/* Motivational Banner */}
      <MotivationalBanner />

      {/* Quick Stats */}
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
