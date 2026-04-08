'use client';

import { weekDays, workoutSchedule } from '@/app/data/mock-data';

export function WeeklyCalendar() {
  const today = new Date().getDay();
  // Convert Sunday=0 to Monday=0 based index
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <div className="rounded-2xl bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">This Week</h3>
      <div className="flex items-center justify-between gap-1">
        {weekDays.map((day, index) => {
          const isToday = index === todayIndex;
          const workout = workoutSchedule[day];
          const hasWorkout = workout !== null;
          const isPast = index < todayIndex;
          
          return (
            <button
              key={day}
              className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl py-2 transition-all ${
                isToday
                  ? 'bg-primary text-primary-foreground'
                  : hasWorkout && !isPast
                  ? 'bg-secondary hover:bg-secondary/80'
                  : 'hover:bg-secondary/50'
              }`}
            >
              <span className={`text-[10px] font-medium uppercase ${
                isToday ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {day}
              </span>
              <span className={`text-sm font-bold ${
                isToday ? 'text-primary-foreground' : ''
              }`}>
                {8 + index}
              </span>
              {hasWorkout && (
                <div className={`h-1.5 w-1.5 rounded-full ${
                  isToday ? 'bg-primary-foreground' : isPast ? 'bg-muted-foreground' : 'bg-primary'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
