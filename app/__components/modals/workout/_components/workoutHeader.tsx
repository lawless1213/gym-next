"use client";

import { IconClock, IconPlayerPauseFilled, IconPlayerPlay, IconX } from "@tabler/icons-react";

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
        <button
          onClick={onTogglePause}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground cursor-pointer"
          aria-label={isPaused ? "Resume" : "Pause"}>
          {isPaused ? <IconPlayerPlay className="h-5 w-5" /> : <IconPlayerPauseFilled className="h-5 w-5" />}
        </button>

        <div className="text-center">
          <h1 className="font-bold text-foreground">{title}</h1>
          <div className="flex items-center justify-center gap-1 text-sm text-primary">
            <IconClock className="h-3.5 w-3.5" />
            <span className="font-mono font-semibold">{elapsedTime}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground cursor-pointer hover:text-foreground"
          aria-label="Close">
          <IconX className="h-5 w-5" />
        </button>
      </div>

      <div className="h-1 w-full bg-secondary">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}