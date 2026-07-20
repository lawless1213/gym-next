"use client";

import { Exercise } from "@/app/types";
import { IconBarbell } from "@tabler/icons-react";
import { cn } from "@/app/lib/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode, MouseEventHandler } from "react";

export type ExerciseCardData = Pick<Exercise, "name" | "muscleGroup"> &
  Partial<Pick<Exercise, "imageUrl" | "isCustom">>;

export interface ExerciseCardProps {
  exercise: ExerciseCardData;
  className?: string;
  trailing?: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  showCustomBadge?: boolean;
  as?: "div" | "button";
}

export function ExerciseCard({
  exercise,
  className,
  trailing,
  onClick,
  disabled = false,
  showCustomBadge = true,
  as,
}: ExerciseCardProps) {
  const t = useTranslations("components.exerciseCard");
  const Component = as ?? (onClick ? "button" : "div");
  const isButton = Component === "button";

  return (
    <Component
      type={isButton ? "button" : undefined}
      disabled={isButton ? disabled : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 bg-card p-3 text-left",
        disabled && "opacity-40 cursor-not-allowed select-none",
        onClick && !disabled && "cursor-pointer",
        className,
      )}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
        {exercise.imageUrl ? (
          <Image
            width={100}
            height={100}
            src={exercise.imageUrl}
            alt={exercise.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <IconBarbell className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-foreground">{exercise.name}</h3>
          {showCustomBadge && exercise.isCustom && (
            <span className="shrink-0 rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
              {t("custom")}
            </span>
          )}
        </div>
        <p className="truncate text-sm text-muted-foreground">{exercise.muscleGroup}</p>
      </div>

      {trailing}
    </Component>
  );
}
