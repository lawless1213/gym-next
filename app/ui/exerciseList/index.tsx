'use client';

import { Exercise } from '@/app//types';
import { IconBarbell, IconChevronRight } from '@tabler/icons-react';
import { cn } from '@/app/lib/utils';

interface ExerciseListItemProps {
  exercise: Exercise;
  onClick: () => void;
}

export function ExerciseListItem({ exercise, onClick }: ExerciseListItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl bg-card p-3 text-left transition-colors hover:bg-secondary"
    >
      {/* Thumbnail */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
        <IconBarbell className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-foreground">{exercise.name}</h3>
          {exercise.isCustom && (
            <span className="shrink-0 rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
              Custom
            </span>
          )}
        </div>
        <p className="truncate text-sm text-muted-foreground">{exercise.muscleGroup}</p>
      </div>

      {/* Arrow */}
      <IconChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </button>
  );
}

interface ExerciseCategoryProps {
  title: string;
  exercises: Exercise[];
  onExerciseClick: (exercise: Exercise) => void;
}

export function ExerciseCategory({ title, exercises, onExerciseClick }: ExerciseCategoryProps) {
  return (
    <div className="space-y-2">
      <h3 className="px-1 text-sm font-semibold text-muted-foreground">{title}</h3>
      <div className="space-y-2">
        {exercises.map((exercise) => (
          <ExerciseListItem
            key={exercise.id}
            exercise={exercise}
            onClick={() => onExerciseClick(exercise)}
          />
        ))}
      </div>
    </div>
  );
}
