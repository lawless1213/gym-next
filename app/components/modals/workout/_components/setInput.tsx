'use client';

import { useState } from 'react';
import { WorkoutSet } from '@/app/types';
import { cn } from '@/app/lib/utils';
import { IconCheck, IconMinus, IconPlus } from '@tabler/icons-react';

interface SetInputProps {
  set: WorkoutSet;
  setNumber: number;
  onUpdate?: (updates: Partial<WorkoutSet>) => void;
  onComplete?: () => void;
}

export function SetInput({ set, setNumber, onUpdate, onComplete }: SetInputProps) {
  // const [weight, setWeight] = useState(set.weight || set.lastWeight || 0);
  const [reps, setReps] = useState(set.reps || 0);

  const handleWeightChange = (delta: number) => {
    // const newWeight = Math.max(0, weight + delta);
    // setWeight(newWeight);
    // onUpdate({ weight: newWeight });
  };

  const handleRepsChange = (delta: number) => {
    const newReps = Math.max(0, reps + delta);
    setReps(newReps);
    // onUpdate({ reps: newReps });
  };

  const handleComplete = () => {
    // onUpdate({ weight, reps, completed: true });
    // onComplete();
  };

  return (
    <div className={cn(
      "flex items-center gap-3 rounded-xl p-3 transition-all",
      set.completed 
        ? "bg-primary/10 ring-1 ring-primary/30" 
        : "bg-secondary"
    )}>
      {/* Set Number */}
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
        set.completed 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted text-muted-foreground"
      )}>
        {set.completed ? <IconCheck className="h-4 w-4" /> : setNumber}
      </div>

      {/* Weight Input */}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase text-muted-foreground">Weight</span>
          {/* {set.lastWeight !== undefined && (
            <span className="text-[10px] text-muted-foreground">
              Last: {set.lastWeight}kg
            </span>
          )} */}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleWeightChange(-2.5)}
            disabled={set.completed}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label="Decrease weight"
          >
            <IconMinus className="h-3.5 w-3.5" />
          </button>
          <input
            type="number"
            // value={weight || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              // setWeight(val);
              // onUpdate({ weight: val });
            }}
            disabled={set.completed}
            className="h-8 w-16 rounded-lg bg-background text-center text-sm font-semibold text-foreground outline-none ring-1 ring-border focus:ring-primary disabled:opacity-50"
            placeholder="kg"
          />
          <button
            onClick={() => handleWeightChange(2.5)}
            disabled={set.completed}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label="Increase weight"
          >
            <IconPlus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Reps Input */}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase text-muted-foreground">Reps</span>
          {/* {set.lastReps !== undefined && (
            <span className="text-[10px] text-muted-foreground">
              Last: {set.lastReps}
            </span>
          )} */}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleRepsChange(-1)}
            disabled={set.completed}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label="Decrease reps"
          >
            <IconMinus className="h-3.5 w-3.5" />
          </button>
          <input
            type="number"
            value={reps || ''}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              setReps(val);
              // onUpdate({ reps: val });
            }}
            disabled={set.completed}
            className="h-8 w-12 rounded-lg bg-background text-center text-sm font-semibold text-foreground outline-none ring-1 ring-border focus:ring-primary disabled:opacity-50"
            placeholder="#"
          />
          <button
            onClick={() => handleRepsChange(1)}
            disabled={set.completed}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            aria-label="Increase reps"
          >
            <IconPlus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Complete Button */}
      <button
        onClick={handleComplete}
        // disabled={set.completed || (weight === 0 && reps === 0)}
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all",
          set.completed
            ? "bg-primary text-primary-foreground"
            : "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
        )}
        aria-label="Complete set"
      >
        <IconCheck className="h-5 w-5" />
      </button>
    </div>
  );
}
