'use client';

import { IconCalendarWeekFilled, IconClock, IconBarbell, IconTrendingUp} from '@tabler/icons-react';
import { getUserHistoryForPeriod } from '../lib/services/history';
import { useUser } from "@/app/hooks/useUser";
import { useEffect, useState } from "react";
import { WorkoutSession } from '../types';
import { useTranslations } from "next-intl";
import { getDateOfWeek } from '../lib/utils';

export default function History() {
  const t = useTranslations("History");
  const tMonth = useTranslations("components.month");
  
  const { user } = useUser();
  const userId = user?.uid;
  const startOfWeek = getDateOfWeek('start');
  const endOfWeek = getDateOfWeek('end');
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const weeklyVolume = history.reduce((total, workout) => total + (workout.volume ?? 0), 0);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      const data = await getUserHistoryForPeriod(userId, startOfWeek, endOfWeek);
      setHistory(data);
      setLoading(false);
    };
    fetchData();
  }, [userId]);
  
  return (
    <div className="flex flex-col gap-4 pb-4">
      <header>
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </header>

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
        {history.map((workout) => {
          const date = new Date(workout.startedAt);
          const volume = workout.volume ?? 0;
          
          return(
          <button
            key={workout.id}
            className="flex w-full items-center gap-4 rounded-xl bg-card p-4 text-left transition-colors hover:bg-secondary"
          >
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary">
              <span className="text-xs font-medium text-muted-foreground">
                {tMonth(`short.${String(date.getMonth() + 1)}`)}
              </span>
							<span className="text-lg font-bold text-foreground">
								{date.getDate()}
							</span>
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
              <p className="font-semibold text-foreground">
                {volume >= 1000 ? `${(volume / 1000).toFixed(1)}K` : volume}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('list.kg')}
              </p>
            </div>
          </button>
        )})}
      </div>
    </div>
  );
}
