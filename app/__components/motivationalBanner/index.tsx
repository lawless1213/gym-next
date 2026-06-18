"use client";

import { totalHistoryVolume } from "@/app/lib/utils";
import { PersonalRecord, RecordsMap, WorkoutSession } from "@/app/types";
import { IconFlame, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

export function MotivationalBanner({ records, lastWeekHistory, prevWeekHistory }: { records: PersonalRecord[]; lastWeekHistory: WorkoutSession[]; prevWeekHistory: WorkoutSession[] }) {
  const thisVolume = totalHistoryVolume(lastWeekHistory ?? []);
  const prevVolume = totalHistoryVolume(prevWeekHistory ?? []);

  const diff = thisVolume - prevVolume;
  const percent = prevVolume > 0 ? ((diff / prevVolume) * 100).toFixed(1) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/20 via-primary/10 to-transparent p-5">
      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <IconFlame className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-primary">{`${records.length} PRs`}</span>
        </div>
        <h3 className="mb-1 text-lg font-bold text-foreground">Keep pushing your limits!</h3>
        <p className="text-sm text-muted-foreground">
          {`You are on track for your best month yet. 
          ${records.length}
          PRs this month!`}
        </p>
        <div className="mt-3 flex items-center gap-2">
          {
            diff < 0 ?
            <IconTrendingUp className="h-4 w-4 text-primary" />
            :
            <IconTrendingDown className="h-4 w-4 text-red-500" />
          }
          <span className={`text-xs font-medium  ${diff < 0 ? 'text-primary' : "text-red-500"}`}>{percent}% volume vs last week</span>
        </div>
      </div>
    </div>
  );
}
