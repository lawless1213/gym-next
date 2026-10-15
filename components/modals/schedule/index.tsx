"use client";

import { ModalWrapper } from "../modal-wrapper";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { IconCheck } from "@tabler/icons-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRoutines } from "@/hooks/useServices/useRoutines";
import RoutineCard from "@/components/shared/cards/RoutineCard";
import { useScheduleModal } from "@/hooks/useModals/useScheduleModal";
import { useTranslations } from "next-intl";
import { weekDays } from "@/types";
import { editUserSchedule } from "@/lib/actions/shedule";
import { ScheduleFormData, scheduleSchema } from "@/lib/schemas";

export function ScheduleEditModal() {
  const tDays = useTranslations("components.day");
  const t = useTranslations("schedule.modal");

  const { user } = useAuth();
  const userId = user?.uid;
  const queryClient = useQueryClient();

  const { data: routines = [] } = useRoutines(userId);
  const { confirm, close, dayIndex, routineList } = useScheduleModal();

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    mode: "onChange",
    defaultValues: {
      routines: [],
    },
  });

  useEffect(() => {
    if (routineList) {
      reset({
        routines: routineList.map((r) => ({ routineId: r.id })),
      });
    }
  }, [routineList, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "routines",
  });

  const isSelected = (id: string) => fields.some((f) => f.routineId === id);

  const toggle = (routineId: string) => {
    const index = fields.findIndex((f) => f.routineId === routineId);

    if (index !== -1) {
      remove(index);
    } else {
      append({ routineId: routineId });
    }
  };

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      const ok = await confirm({
        title: "",
        description: t("confirm.description"),
        cancelLabel: t("confirm.cancel"),
        confirmLabel: t("confirm.confirm"),
      });

      if (ok) {
        await editUserSchedule(user.uid, {
          dayIndex,
          routineIds: data.routines.map((r) => r.routineId),
        });
        queryClient.invalidateQueries({ queryKey: ["schedule", user.uid] });
        toast.success(`${tDays(`default.${weekDays[dayIndex]}`)} - ${t("success")}`);
        close();
      }
    } catch (err) {
      toast.error(t("error"));
    }
  };

  return (
    <ModalWrapper
      modalType="schedule"
      title={`${tDays(`default.${weekDays[dayIndex]}`)} - ${t("title")}`}>
      <form
        className="flex flex-col gap-4 overflow-y-auto"
        onSubmit={handleSubmit(onSubmit)}>
        {routines.map((routine) => {
          const selected = isSelected(routine.id);

          return (
            <div
              key={routine.id}
              className="flex items-start gap-2">
              {/* Clicking the card only expands it; selection is done with the circle. */}
              <div className="min-w-0 flex-1">
                <RoutineCard routine={routine} />
              </div>
              <button
                type="button"
                role="checkbox"
                aria-checked={selected}
                aria-label={t("select", { name: routine.name })}
                onClick={() => toggle(routine.id)}
                className={`mt-6 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-solid transition-[0.2s] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${selected ? "border-primary bg-primary" : "border-muted-foreground bg-card hover:border-primary"}`}>
                {selected && (
                  <IconCheck
                    stroke={3}
                    className="h-4 w-4 text-primary-foreground"
                  />
                )}
              </button>
            </div>
          );
        })}
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty || !isValid}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg">
          {t("submit")}
        </Button>
      </form>
    </ModalWrapper>
  );
}
