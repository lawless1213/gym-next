'use client';

import { useState, useMemo } from 'react';
import { exercises, routines } from '@/app/data/mock-data';
import { Exercise } from '@/app/types';
import { ExerciseCategory } from '@/app/ui/exerciseList';
import { IconSearch, IconPlus, IconBarbell, IconFolderOpen } from '@tabler/icons-react';
import { cn } from '@/app/lib/utils';

type LibraryTab = 'exercises' | 'routines';

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<LibraryTab>('exercises');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = useMemo(() => {
    if (!searchQuery) return exercises;
    const query = searchQuery.toLowerCase();
    return exercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(query) ||
        ex.muscleGroup.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const groupedExercises = useMemo(() => {
    const groups: Record<string, Exercise[]> = {};
    filteredExercises.forEach((ex) => {
      if (!groups[ex.muscleGroup]) {
        groups[ex.muscleGroup] = [];
      }
      groups[ex.muscleGroup].push(ex);
    });
    return groups;
  }, [filteredExercises]);

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-foreground">Library</h1>
        <p className="text-sm text-muted-foreground">Your exercises and routines</p>
      </header>

      {/* Tabs */}
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
        <>
          {/* Search */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Exercise List */}
          <div className="space-y-6">
            {Object.entries(groupedExercises).map(([group, exs]) => (
              <ExerciseCategory
                key={group}
                title={group}
                exercises={exs}
                onExerciseClick={() => {}}
              />
            ))}
          </div>

          {/* Create Exercise FAB */}
          <button
            // onClick={onCreateExercise}
            className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label="Create exercise"
          >
            <IconPlus className="h-6 w-6" />
          </button>
        </>
      ) : (
        <>
          {/* Routines List */}
          <div className="space-y-3">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="rounded-xl bg-card p-4"
                style={{ borderLeft: `4px solid ${routine.color}` }}
              >
                <h3 className="font-semibold text-foreground">{routine.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {routine.exercises.length} exercises
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {routine.exercises.slice(0, 3).map((ex) => (
                    <span
                      key={ex.id}
                      className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {ex.name}
                    </span>
                  ))}
                  {routine.exercises.length > 3 && (
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      +{routine.exercises.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Create Routine FAB */}
          <button
            // onClick={onCreateRoutine}
            className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label="Create routine"
          >
            <IconPlus className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
}
