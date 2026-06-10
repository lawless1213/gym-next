'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useRecordsThisWeek } from '@/app/hooks/useServices/useRecords';
import { PersonalRecord, RecordsMap } from '@/app/types';
import { IconFlame, IconTrendingUp } from '@tabler/icons-react';

export function MotivationalBanner({ records }: { records: PersonalRecord[] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/20 via-primary/10 to-transparent p-5">
      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <IconFlame className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-primary">{`${records.length} PRs`}</span>
        </div>
        <h3 className="mb-1 text-lg font-bold text-foreground">
          Keep pushing your limits!
        </h3>
        <p className="text-sm text-muted-foreground">
          {`You are on track for your best month yet. 
          ${records.length}
          PRs this week!`}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <IconTrendingUp className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">+15% volume vs last week</span>
        </div>
      </div>
    </div>
  );
}