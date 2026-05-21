'use client';

import { useState } from 'react';
import { WorkoutExercise, WorkoutSet } from '@/app/types';
import { cn } from '@/app/lib/utils';
import { IconBarbell, IconChevronDown, IconChevronUp, IconPlus } from '@tabler/icons-react';
import { SetInput } from './setInput';

interface ExerciseCardProps {
  workoutExercise: WorkoutExercise;
  onUpdateSet: (setId: string, updates: Partial<WorkoutSet>) => void;
  onAddSet: () => void;
}

export function ExerciseCard({ workoutExercise, onUpdateSet, onAddSet }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(true);
  const { name, muscleGroup, sets } = workoutExercise;
  
  const completedSets = sets.filter(s => s.completed).length;
  const totalSets = sets.length;
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-2xl bg-card">
      {/* Exercise Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        {/* Exercise Thumbnail */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary">
          <IconBarbell className="h-6 w-6 text-muted-foreground" />
        </div>

        {/* Exercise Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{muscleGroup}</p>
          {/* Progress Bar */}
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div 
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Set Counter & Expand */}
        <div className="flex items-center gap-2">
          <span className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            completedSets === totalSets 
              ? "bg-primary/20 text-primary" 
              : "bg-secondary text-muted-foreground"
          )}>
            {completedSets}/{totalSets}
          </span>
          {expanded ? (
            <IconChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <IconChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Sets List */}
      {expanded && (
        <div className="flex flex-col gap-2 px-4 pb-4">
          {sets.map((set, index) => (
            <SetInput
              // key={set.id}
              set={set}
              setNumber={index + 1}
              // onUpdate={(updates) => onUpdateSet(set.id, updates)}
              // onComplete={() => onUpdateSet(set.id, { completed: true })}
            />
          ))}
          
          {/* Add Set Button */}
          <button
            onClick={onAddSet}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <IconPlus className="h-4 w-4" />
            Add Set
          </button>
        </div>
      )}
    </div>
  );
}
