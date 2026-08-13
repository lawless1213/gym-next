"use client";

import { useState } from "react";
import { WorkoutSet } from "@/types";
import { cn } from "@/lib/utils";
import { IconCheck, IconMinus, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

interface SetInputProps {
  set: WorkoutSet;
  setNumber: number;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onComplete: () => void;
}

export function SetInput({ set, setNumber, onUpdate, onComplete }: SetInputProps) {
  const t = useTranslations("workout.modal.exercise");
  const [weight, setWeight] = useState(set.weight || 0);
  const [reps, setReps] = useState(set.reps || 0);

  const handleWeightChange = (delta: number) => {
    const newWeight = Math.max(0, weight + delta);
    setWeight(newWeight);
    onUpdate({ weight: newWeight });
  };

  const handleRepsChange = (delta: number) => {
    const newReps = Math.max(0, reps + delta);
    setReps(newReps);
    onUpdate({ reps: newReps });
  };

  const handleComplete = () => {
    const newCompleted = !set.completed;
    onUpdate({ weight, reps, completed: newCompleted });
    if (newCompleted) onComplete();
  };

  return (
    <div className={cn("flex items-center gap-2 rounded-xl p-3 transition-all", set.completed ? "bg-primary/10 ring-1 ring-primary/30" : "bg-secondary")}>
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold text-muted-foreground">{setNumber}</div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase text-muted-foreground">{t("weight")}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleWeightChange(-2.5)}
            disabled={set.completed}
            aria-label="Decrease weight">
            <IconMinus className="h-3.5 w-3.5" />
          </Button>
          <input
            type="number"
            value={weight || ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              setWeight(val);
              onUpdate({ weight: val });
            }}
            disabled={set.completed}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none h-8 w-10 sm:w16 rounded-lg bg-background text-center text-sm font-semibold text-foreground outline-none ring-1 ring-border focus:ring-primary disabled:opacity-50"
            placeholder="kg"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleWeightChange(2.5)}
            disabled={set.completed}
            aria-label="Increase weight">
            <IconPlus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase text-muted-foreground">{t("reps")}</span>
          {/* {set.lastReps !== undefined && (
            <span className="text-[10px] text-muted-foreground">
              Last: {set.lastReps}
            </span>
          )} */}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleRepsChange(-1)}
            disabled={set.completed}
            aria-label="Decrease reps">
            <IconMinus className="h-3.5 w-3.5" />
          </Button>
          <input
            type="number"
            value={reps || ""}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              setReps(val);
              onUpdate({ reps: val });
            }}
            disabled={set.completed}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none h-8 w-10 sm:w16 rounded-lg bg-background text-center text-sm font-semibold text-foreground outline-none ring-1 ring-border focus:ring-primary disabled:opacity-50"
            placeholder="#"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleRepsChange(1)}
            disabled={set.completed}
            aria-label="Increase reps">
            <IconPlus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <Button
        onClick={handleComplete}
        disabled={weight === 0 || reps === 0}
        variant={set.completed ? "default" : "ghost"}
        size="icon-xl"
        aria-label="Complete set">
        <IconCheck className="size-5" />
      </Button>
    </div>
  );
}
