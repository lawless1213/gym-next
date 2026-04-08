import {useTranslations} from 'next-intl';
import {IconUser} from '@tabler/icons-react';
import QuickStat from '@/app/ui/common/quickStat';
import {WeeklyCalendar} from '@/app/ui/weeklyCalendar';
import {WorkoutCard} from '@/app/ui/cards/workoutCard';
import { routines } from '@/app/data/mock-data';
import { MotivationalBanner } from "@/app/ui/motivationalBanner"



export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <div className="flex flex-col gap-4 pb-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t('header.welcome')}</p>
          <h1 className="text-2xl font-bold text-foreground">Andrew</h1>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
          <IconUser className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      {/* Weekly Calendar */}
      <WeeklyCalendar />

      {/* Next Workout Card */}
      <WorkoutCard routine={routines[0]} />

      {/* Motivational Banner */}
      <MotivationalBanner />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <QuickStat label="Workouts" value="47" sublabel="This month" />
        <QuickStat label="Volume" value="52K" sublabel="kg lifted" />
        <QuickStat label="PRs" value="8" sublabel="This month" />
      </div>
    </div>
  );
}
