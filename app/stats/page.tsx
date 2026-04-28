'use client';

import { useState } from 'react';
import { IconTrophy, IconActivity } from '@tabler/icons-react';
import { cn } from '@/app/lib/utils';

import { Header } from '../components/Header';
import { useTranslations } from 'next-intl';
import Progress from './_components/progress';
import Records from './_components/records';

type StatsTab = 'progress' | 'records';

export default function Stats() {
  const t = useTranslations("stats");
  const [activeTab, setActiveTab] = useState<StatsTab>('progress');

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <Header
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl bg-secondary p-1">
        <button
          onClick={() => setActiveTab('progress')}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
            activeTab === 'progress'
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <IconActivity className="h-4 w-4" />
          Progress
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
            activeTab === 'records'
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <IconTrophy className="h-4 w-4" />
          Records
        </button>
      </div>
      {activeTab === 'progress' ? <Progress/> : <Records/> }
    </div>
  );
}
