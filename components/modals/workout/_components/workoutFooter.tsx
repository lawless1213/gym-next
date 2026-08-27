"use client";

import { IconChecks } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

interface WorkoutFooterProps {
  completedSets: number;
  totalSets: number;
  onFinish: () => void;
}

export function WorkoutFooter({ completedSets, totalSets, onFinish }: WorkoutFooterProps) {
  const t = useTranslations("workout.modal");

  return (
    <div className="sticky bottom-0 bg-card p-4">
      <Button
        onClick={onFinish}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
        disabled={completedSets === 0}>
        <IconChecks className="h-5 w-5" />
        {t("submit")} ({completedSets}/{totalSets} sets)
      </Button>
    </div>
  );
}