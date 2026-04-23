'use client';

import { IconCalendarWeekFilled, IconClock, IconBarbell, IconTrendingUp} from '@tabler/icons-react';
import { getUserHistoryForPeriod } from '../lib/services/history';
import { useUser } from "@/app/hooks/useUser";
import { useEffect, useState } from "react";
import { WorkoutSession as workoutSessionType } from '../types';
import { useTranslations } from "next-intl";
import { getDateOfWeek } from '../lib/utils';
import WorkoutSession from './_components/workoutSession';
import { Header } from '../ui/Header';
import { useHistoryForPeriod } from '../hooks/useServices/useHistory';

export default function History() {
  const t = useTranslations("History");
  const tMonth = useTranslations("components.month");
  
  const { user } = useUser();
  const userId = user?.uid;
  const startOfWeek = getDateOfWeek('start');
  const endOfWeek = getDateOfWeek('end');
  
  const { data: history = [], isLoading: loading } = useHistoryForPeriod(userId, startOfWeek, endOfWeek);
  
  const weeklyVolume = history.reduce((total, workout) => total + (workout.volume ?? 0), 0);
  
  return (
    <div className="flex flex-col gap-4 pb-4">
      <Header
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendarWeekFilled className="h-4 w-4" />
            <span className="text-sm">{t('summary.exercises')}</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{history.length}</p>
          <p className="text-xs text-muted-foreground">{t('summary.textExercises')}</p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconTrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm">{t('summary.volume')}</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {weeklyVolume >= 1000 ? `${(weeklyVolume / 1000).toFixed(1)}K` : weeklyVolume}
          </p>
          <p className="text-xs text-muted-foreground">{t('summary.textVolume')}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">{t('list.recentTitle')}</h2>
        {history.map((workout) => (
          <WorkoutSession key={workout.id} {...workout} />
        ))}
      </div>
    </div>
  );
}
