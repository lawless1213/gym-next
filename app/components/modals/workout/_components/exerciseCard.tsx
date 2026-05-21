"use client";

import { useState } from "react";
import { WorkoutExercise, WorkoutSet } from "@/app/types";
import { cn } from "@/app/lib/utils";
import { IconBarbell, IconChevronDown, IconChevronUp, IconMinus, IconPlus } from "@tabler/icons-react";
import { SetInput } from "./setInput";

interface ExerciseCardProps {
  workoutExercise: WorkoutExercise;
  onUpdateSet: (id: number, updates: Partial<WorkoutSet>) => void;
  onAddSet: () => void;
  onRemoveSet: () => void;
}

export function ExerciseCard({ workoutExercise, onUpdateSet, onAddSet, onRemoveSet }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(true);
  const { name, muscleGroup, sets } = workoutExercise;

  const completedSets = sets.filter((s) => s.completed).length;
  const totalSets = sets.length;
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-2xl bg-card p-0.5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary">
          {workoutExercise.imageUrl ? (
            <img
              src={workoutExercise.imageUrl}
              alt="Preview"
              className="h-full w-full object-contain"
            />
          ) : (
            <IconBarbell className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{muscleGroup}</p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", completedSets === totalSets ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground")}>
            {completedSets}/{totalSets}
          </span>
          {expanded ? <IconChevronUp className="h-5 w-5 text-muted-foreground" /> : <IconChevronDown className="h-5 w-5 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="flex flex-col gap-2 mt-3">
          {sets.map((set, index) => (
            <SetInput
              key={index}
              set={set}
              setNumber={index + 1}
              onUpdate={(updates) => onUpdateSet(index, updates)}
              onComplete={() => onUpdateSet(index, { completed: true })}
            />
          ))}

          <div className="flex gap-2">
            <button
              onClick={onRemoveSet}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-red-500 hover:text-red-500">
              <IconMinus className="h-4 w-4" />
              Add Set
            </button>
            <button
              onClick={onAddSet}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <IconPlus className="h-4 w-4" />
              Add Set
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
