"use client";

import { Routine } from "@/app/types";
import { IconPlayerPlayFilled, IconClock, IconBarbell } from "@tabler/icons-react";
import { Button } from "@/app/ui/common/button";

interface WorkoutCardProps {
  routine: Routine;
}

export function WorkoutCard({ routine }: WorkoutCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-card">
      <div
        className="relative p-4"
        style={{
          background: `linear-gradient(135deg, ${routine.color}30, ${routine.color}10)`,
          borderLeft: `4px solid ${routine.color}`,
        }}>
        <div className="flex h-full flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">Next Planned</span>
            <h3 className="text-xl font-bold text-foreground">{routine.name}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <IconBarbell className="h-3.5 w-3.5" />
              {routine.exercises.length} exercises
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {routine.exercises.slice(0, 3).map((ex) => (
              <span
                key={ex.id}
                className="rounded-md bg-secondary px-2 py-0.5 text-xs text-foreground">
                {ex.name}
              </span>
            ))}
            {routine.exercises.length > 3 && <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">+{routine.exercises.length - 3} more</span>}
          </div>
        </div>
      </div>
      <div className="p-4 pt-3">
        <Button
          className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg">
          <IconPlayerPlayFilled className="h-5 w-5 fill-current" />
          Start Workout
        </Button>
      </div>
    </div>
  );
}
