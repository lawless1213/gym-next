"use client";

import { useTranslations } from "next-intl";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import WorkoutSessionCard from "./WorkoutSessionCard";
import { WorkoutSession } from "@/types";

interface WorkoutListProps {
  history: WorkoutSession[];
  loading: boolean;
}

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

export default function WorkoutList({ history, loading }: WorkoutListProps) {
  const t = useTranslations("history");

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground">{t("list.recentTitle")}</h2>
      <SkeletonSwitcher
        isLoading={loading}
        skeleton={HistorySkeleton}>
        <div className="space-y-3 w-full">
          {history.map((workout) => (
            <WorkoutSessionCard
              key={workout.id}
              {...workout}
            />
          ))}
        </div>
      </SkeletonSwitcher>
    </div>
  );
}
