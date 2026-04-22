import { IconClock, IconBarbell } from "@tabler/icons-react";
import { getUserHistoryForPeriod } from "@/app/lib/services/history";
import { useUser } from "@/app/hooks/useUser";
import { useEffect, useState } from "react";
import { WorkoutSession as WorkoutSessionType } from "@/app/types";
import { useTranslations } from "next-intl";
import { getDateOfWeek } from "@/app/lib/utils";

export default function WorkoutSession(workout: WorkoutSessionType) {
  const t = useTranslations("History");
  const tMonth = useTranslations("components.month");

  const date = new Date(workout.startedAt);
  const volume = workout.volume ?? 0;

  return (
    <button
      className="rounded-xl bg-card p-4 text-left transition-colors hover:bg-secondary">
      <div className="flex w-full items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary">
          <span className="text-xs font-medium text-muted-foreground">{tMonth(`short.${String(date.getMonth() + 1)}`)}</span>
          <span className="text-lg font-bold text-foreground">{date.getDate()}</span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{workout.routineName}</h3>
          </div>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <IconClock className="h-3.5 w-3.5" />
              {workout.duration}m
            </span>
            <span className="flex items-center gap-1">
              <IconBarbell className="h-3.5 w-3.5" />
              {workout.exercises.length}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="font-semibold text-foreground">{volume >= 1000 ? `${(volume / 1000).toFixed(1)}K` : volume}</p>
          <p className="text-xs text-muted-foreground">{t("list.kg")}</p>
        </div>
      </div>
			<div>
				{workout.exercises.map((exercise) => (
          <div>
						<p>{exercise.name}</p>
						{exercise.sets.map((set) => (
							<div>
								<p>{set.completed}</p>
								<p>{set.reps}</p>
								<p>{set.weight}</p>
							</div>
						))}
					</div>
        ))}
			</div>
    </button>
  );
}
