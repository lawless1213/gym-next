'use client';

import { useState, useMemo, useEffect } from 'react';
import { exercises, routines } from '@/app/data/mock-data';
import { Exercise } from '@/app/types';
import { ExerciseCategory } from '@/app/components/exerciseList';
import { IconSearch, IconPlus, IconBarbell, IconFolderOpen } from '@tabler/icons-react';
import { cn } from '@/app/lib/utils';
import Exercises from './content/exercises';
import Routines from './content/routines';
import { useTranslations } from "next-intl";
import { Header } from '../components/Header';


type LibraryTab = 'exercises' | 'routines';

export default function LibraryScreen() {
  const t = useTranslations("Library");
  const [activeTab, setActiveTab] = useState<LibraryTab>('exercises');

  return (
    <div className="flex flex-col gap-4 pb-4">
      <Header
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="flex gap-2 rounded-xl bg-secondary p-1">
        <button
          onClick={() => setActiveTab('exercises')}
          className={cn(
            "cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
            activeTab === 'exercises'
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <IconBarbell className="h-4 w-4" />
          {t('tabs.exercises')}
        </button>
        <button
          onClick={() => setActiveTab('routines')}
          className={cn(
            "cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
            activeTab === 'routines'
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <IconFolderOpen className="h-4 w-4" />
          {t('tabs.routines')}
        </button>
      </div>

      {activeTab === 'exercises' ? (
        <Exercises />
      ) : (
        <Routines />
      )}
    </div>
  );
}
