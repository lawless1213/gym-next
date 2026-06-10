"use client";

import { ModalWrapper } from "../modal-wrapper";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/__components/buttons/button";
import { useAuth } from "@/app/hooks/useAuth";
import { Input } from "@/app/__components/form/input";
import { AUTH_ERRORS } from "@/app/lib/errors/auth";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Routine, RoutinesExercise } from "@/app/types";
import { useAllExercises } from "@/app/hooks/useServices/useExercises";
import { toast } from "sonner";
import { createUserRoutine } from "@/app/lib/actions/routine";
import { useQueryClient } from "@tanstack/react-query";
import { useRoutines } from "@/app/hooks/useServices/useRoutines";
import RoutineCard from "../../cards/routine";
import { useCalendarModal } from "@/app/hooks/useModals/useCalendarModal";
import { useTranslations } from "next-intl";
import { weekDays } from "@/app/types";

const calendarSchema = z.object({
  routines: z.array(z.object({ routineId: z.string() })).min(1, "Додай хоча б одну програму"),
});

type CalendarFormData = z.infer<typeof calendarSchema>;

export function CalendarEditModal() {
  const tDays = useTranslations("components.day");
  const { user } = useAuth();
  const userID = user?.uid;
  const queryClient = useQueryClient();

  const { data: routines = [], isLoading: loading } = useRoutines(userID);
  const { confirm, close, dayIndex, routineList } = useCalendarModal();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<CalendarFormData>({
    resolver: zodResolver(calendarSchema),
    mode: "onTouched",
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
  }, [routineList]);

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

  const onSubmit = async (data: CalendarFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      console.log("Selected routines:", data.routines);

      const ok = await confirm({
        title: "",
        description: `Впевнені у зміні програм на ...?`,
        cancelLabel: " Ні",
        confirmLabel: "Так",
      });

      if (ok) {
        // await createUserRoutine(user.uid, data);
        // queryClient.invalidateQueries({ queryKey: ["schedule", user.uid] });
        toast.success(`${tDays(`default.${weekDays[dayIndex]}`)} - програми оновлено!`);
        close();
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <ModalWrapper
      modalType="calendar"
      title={`${tDays(`default.${weekDays[dayIndex]}`)} - editing routines`}>
      <form
        className="flex flex-col gap-4 overflow-y-auto"
        onSubmit={handleSubmit(onSubmit)}>
        {routines.map((routine) => {
          return (
            <div
              key={routine.id}
              onClick={() => toggle(routine.id)}
              className="group flex items-center justify-between gap-1 cursor-pointer">
              <RoutineCard {...routine} />
              <div className={`flex w-9 h-9 items-center justify-center rounded-full bg-card cursor-pointer border-2 border-solid ${isSelected(routine.id) ? "bg-primary" : "border-2 border-muted-foreground group-hover:border-primary transition-[0.2s]"}`}>
                {isSelected(routine.id) && (
                  <IconCheck
                    stroke={3}
                    className="h-4 w-4 text-muted-foreground"
                  />
                )}
              </div>
            </div>
          );
        })}
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty || !isValid}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg">
          Create
        </Button>
      </form>
    </ModalWrapper>
  );
}
