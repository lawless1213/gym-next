"use client";

import { IconBarbell } from "@tabler/icons-react";
import { cn, getLocalizedText } from "@/lib/utils";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode, MouseEventHandler } from "react";
import { Exercise } from "@/types";
import { motion } from "motion/react";

export type ExerciseCardData = Pick<Exercise, "name" | "muscleGroup" | "description"> & Partial<Pick<Exercise, "imageUrl" | "isCustom">>;

export interface ExerciseCardProps {
  exercise: ExerciseCardData;
  isOpen?: boolean;
  className?: string;
  trailing?: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  preview?: boolean;
  as?: "div" | "button";
}

export function ExerciseCard({ exercise, isOpen, className, trailing, onClick, disabled = false, preview, as }: ExerciseCardProps) {
  const t = useTranslations("components.exerciseCard");
  const tGroups = useTranslations("components.muscleGroups");
  const locale = useLocale();
  const title = getLocalizedText(exercise.name, locale as any);
  const Component = as ?? (onClick ? "button" : "div");
  const isButton = Component === "button"

  return (
    <Component
      type={isButton ? "button" : undefined}
      disabled={isButton ? disabled : undefined}
      onClick={onClick}
      className={cn("flex w-full items-center gap-4 bg-card p-3 text-left", disabled && "opacity-40 cursor-not-allowed select-none", onClick && !disabled && "cursor-pointer", className)}>
      <motion.div
        className="flex shrink-0 items-center justify-center rounded-xl bg-secondary p-1"
        initial={{ width: 48, height: 48 }}
        animate={{ width: isOpen ? 98 : 48, height: isOpen ? 98 : 48 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}>
        {exercise.imageUrl ? (
          <Image
            width={100}
            height={100}
            src={exercise.imageUrl}
            alt={title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <IconBarbell className="size-full text-muted-foreground" />
          </div>
        )}
      </motion.div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-foreground">{title}</h3>
          {!preview && exercise.isCustom && <span className="shrink-0 rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">{t("custom")}</span>}
          {preview && <span className="shrink-0 rounded-md bg-foreground/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-foreground">{t("preview")}</span>}
        </div>
        <div className="flex gap-2 truncate text-sm text-muted-foreground">
          {exercise.muscleGroup.split(",").map((group) => (
            <span key={group}>{tGroups(group.trim().toLowerCase())}</span>
          ))}
        </div>
      </div>

      {trailing}
    </Component>
  );
}
