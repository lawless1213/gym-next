"use client";

import { IconChecks } from "@tabler/icons-react";
import { Button } from "@/app/__components/common/button";

interface WorkoutFooterProps {
  completedSets: number;
  totalSets: number;
  onFinish: () => void;
}

export function WorkoutFooter({ completedSets, totalSets, onFinish }: WorkoutFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur">
      <Button
        onClick={onFinish}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
        disabled={completedSets === 0}>
        <IconChecks className="h-5 w-5" />
        Finish Workout ({completedSets}/{totalSets} sets)
      </Button>
    </div>
  );
}