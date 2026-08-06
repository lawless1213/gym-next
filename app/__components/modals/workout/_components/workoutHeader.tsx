"use client";

import { Button } from "@/app/__components/common/buttons/button";
import { IconClock, IconPlayerPauseFilled, IconPlayerPlayFilled, IconX } from "@tabler/icons-react";

interface WorkoutHeaderProps {
  title: string;
  elapsedTime: string;
  isPaused: boolean;
  onTogglePause: () => void;
  onClose: () => void;
  progress: number;
}

export function WorkoutHeader({ title, elapsedTime, isPaused, onTogglePause, onClose, progress }: WorkoutHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card backdrop-blur">
      <div className="flex items-center justify-between p-4">
        <Button
          size="icon-lg"
          variant="outline"
          onClick={onTogglePause}
          aria-label={isPaused ? "Resume" : "Pause"}>
          {isPaused ? <IconPlayerPlayFilled className="size-5" /> : <IconPlayerPauseFilled className="size-5" />}
        </Button>

        <div className="text-center">
          <h1 className="font-bold text-foreground">{title}</h1>
          <div className="flex items-center justify-center gap-1 text-sm text-primary">
            <IconClock className="h-3.5 w-3.5" />
            <span className="font-mono font-semibold">{elapsedTime}</span>
          </div>
        </div>

        <Button
          size="icon-lg"
          variant="outline"
          onClick={onClose}
          aria-label="Close">
          <IconX className="size-5" />
        </Button>
      </div>

      <div className="h-1 w-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
