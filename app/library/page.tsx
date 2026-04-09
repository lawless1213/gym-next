'use client';

import { useState, useMemo, useEffect } from 'react';
import { exercises, routines } from '@/app/data/mock-data';
import { Exercise } from '@/app/types';
import { ExerciseCategory } from '@/app/ui/exerciseList';
import { IconSearch, IconPlus, IconBarbell, IconFolderOpen } from '@tabler/icons-react';
import { cn } from '@/app/lib/utils';
import Exercises from './exercises';
import Routines from './routines';

type LibraryTab = 'exercises' | 'routines';

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<LibraryTab>('exercises');

  return (
    <div className="flex flex-col gap-4 pb-4">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Library</h1>
        <p className="text-sm text-muted-foreground">Your exercises and routines</p>
      </header>

      <div className="flex gap-2 rounded-xl bg-secondary p-1">
        <button
          onClick={() => setActiveTab('exercises')}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
            activeTab === 'exercises'
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <IconBarbell className="h-4 w-4" />
          Exercises
        </button>
        <button
          onClick={() => setActiveTab('routines')}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
            activeTab === 'routines'
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <IconFolderOpen className="h-4 w-4" />
          Routines
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
