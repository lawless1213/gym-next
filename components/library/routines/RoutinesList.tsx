"use client";

import { IconMoodPuzzled } from "@tabler/icons-react";
import RoutineCard from "../../shared/cards/RoutineCard";
import { useTranslations } from "next-intl";
import { Routine } from "@/types";
import { useState } from "react";

interface RoutinesListProps {
  routines: Routine[];
}

export default function RoutinesList({ routines }: RoutinesListProps) {
  const t = useTranslations("library.routines");

  const [openRoutineId, setOpenRoutineId] = useState<string | null>(null);

  const toggleRoutine = (id: string) => {
    setOpenRoutineId((prev) => (prev === id ? null : id));
  };

  return routines.length === 0 ? (
    <div className="mt-5 flex flex-col items-center gap-5 text-center text-sm text-muted-foreground">
      <IconMoodPuzzled
        stroke={1.5}
        className="size-25"
      />
      <p>{t("empty")}</p>
    </div>
  ) : (
    <div className="space-y-3 max-md:-mx-4">
      {routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          isOpen={openRoutineId === routine.id}
          onToggle={() => toggleRoutine(routine.id)}
          routine={{ ...routine, editable: true }}
        />
      ))}
    </div>
  );
}
