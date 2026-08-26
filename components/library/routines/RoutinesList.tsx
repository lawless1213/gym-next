"use client";

import { IconPlus } from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";
import RoutineCard from "../../shared/cards/RoutineCard";
import { useRoutines } from "@/hooks/useServices/useRoutines";
import { useModal } from "@/components/modals/modal-store";
import { useTranslations } from "next-intl";
import ActionCard from "@/components/shared/cards/ActionCard";
import { Routine } from "@/types";
import { useState } from "react";

interface RoutinesListProps {
  routines: Routine[];
}

export default function RoutinesList({ routines }: RoutinesListProps) {
  const t = useTranslations("library.routines");
  const { open } = useModal();
  const [openRoutineId, setOpenRoutineId] = useState<string | null>(null);

  const toggleRoutine = (id: string) => {
    setOpenRoutineId((prev) => (prev === id ? null : id));
  };

  return routines.length === 0 ? (
    <ActionCard
      title={t("empty")}
      icon={IconPlus}
      onClick={() => open("routine")}
    />
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
