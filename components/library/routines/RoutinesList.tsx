"use client";

import { IconMoodPuzzled, IconPlus } from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";
import RoutineCard from "../../shared/cards/RoutineCard";
import { useModal } from "@/components/modals/modal-store";
import { useTranslations } from "next-intl";
import { Routine } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

interface RoutinesListProps {
  routines: Routine[];
}

export default function RoutinesList({ routines }: RoutinesListProps) {
  const t = useTranslations("library.routines");
  const tNotification = useTranslations("notification");

  const { user } = useAuth();
  const { open } = useModal();
  const [openRoutineId, setOpenRoutineId] = useState<string | null>(null);

  const isVerified = user?.emailVerified;

  const handleClick = () => {
    if (!isVerified) {
      toast.warning(tNotification("verifyRequiredWarning"));
      return;
    }

    open("routine");
  };

  const toggleRoutine = (id: string) => {
    setOpenRoutineId((prev) => (prev === id ? null : id));
  };

  return routines.length === 0 ? (
    <div className="text-center text-sm text-muted-foreground flex flex-col items-center gap-5 mt-5">
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
