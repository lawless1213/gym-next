'use client';

import { getUserScheddule } from '@/app/lib/services/schedule';
import { useUser } from "@/app/hooks/useUser";
import { useEffect, useState } from 'react';
import { ScheduleMap, weekDays } from '@/app/types';
import { useTranslations } from 'next-intl';


export function WeeklyCalendar() {
  const t = useTranslations("WeeklyCalendar");

  const { user } = useUser();
  const userID = user?.uid;
  const createEmptySchedule = (): ScheduleMap =>
    weekDays.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {} as ScheduleMap);

  const [scheduleDays, setScheduleDays] = useState<ScheduleMap>(createEmptySchedule());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userID) {
      setScheduleDays(createEmptySchedule());
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      const data = await getUserScheddule(userID);
      setScheduleDays(data);
      setLoading(false);
      
    };
    fetchData();
  }, [userID]);

  const today = new Date().getDay();
  const todayDate = new Date().getDate();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <div className="rounded-2xl bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">This Week</h3>
      <div className="flex items-center justify-between gap-1">
        {weekDays.map((day, index) => {
          const isToday = index === todayIndex;
          const workout = scheduleDays[day];
          const hasWorkout = workout.length > 0;
          const isPast = index < todayIndex;
          
          return (
            <button
              key={day}
              className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl py-2 transition-all min-h-[72px] overflow-hidden ${loading && "animate-pulse"} ${
                isToday
                  ? 'bg-primary text-primary-foreground'
                  : hasWorkout && !isPast
                  ? 'bg-secondary hover:bg-secondary/80'
                  : 'hover:bg-secondary/50'
              }`}
            >
              {
                !loading &&
                <>
                  <span className={`text-[12px] font-medium uppercase ${
                isToday ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {t(`${day}`)}
              </span>
              <span className={`text-sm font-bold ${
                isToday ? 'text-primary-foreground' : ''
              }`}>
                {(todayDate - todayIndex) + index}
              </span>
              {hasWorkout && (
                <div className={`h-1.5 w-1.5 rounded-full ${
                  isToday ? 'bg-primary-foreground' : isPast ? 'bg-muted-foreground' : 'bg-primary'
                }`} />
              )}
                </>
              }
              
              <div>
               
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
