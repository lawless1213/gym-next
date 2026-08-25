"use client";

import { ModalWrapper } from "../../modal-wrapper";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/form/input";
import { AUTH_ERRORS } from "@/lib/errors/auth";
import { useModal } from "@/components/modals/modal-store";
import { IconGridDots, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { RoutinesExercise } from "@/types";
import { useAllExercises } from "@/hooks/useServices/useExercises";
import { toast } from "sonner";
import { editUserRoutine } from "@/lib/actions/routine";
import { useQueryClient } from "@tanstack/react-query";
import { useRoutineEditModal } from "@/hooks/useModals/useRoutineEditModal";
import { ExerciseCard } from "@/components/shared/cards/ExerciseCard";
import { useLocale, useTranslations } from "next-intl";
import { RoutineFormData, routineSchema } from "@/lib/schemas/routine.schema";
import { MUSCLE_GROUPS } from "@/data/exercise";
import { getLocalizedText, type Locale } from "@/types/common";

const colors = ["#CCFF00", "#2563EB", "#F97316", "#EF4444", "#8B5CF6", "#10B981"];

export function RoutineEditModal() {
  const t = useTranslations("routine.modal");
  const locale = useLocale() as Locale;
  const tForms = useTranslations("components.forms");
  const tGroups = useTranslations("components.muscleGroups");
  const { user } = useAuth();
  const userId = user?.uid;
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const { close, routine } = useRoutineEditModal();
  const queryClient = useQueryClient();

  const { data: exercises = [], isLoading: loading } = useAllExercises(userId);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<RoutineFormData>({
    resolver: zodResolver(routineSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      color: colors[0],
      exercises: [],
    },
  });

  useEffect(() => {
    if (!routine) return;

    reset({
      title: routine.name,
      color: routine.color,
      exercises: (routine.exercises || []).map((ex) => ({
        exerciseId: ex.id,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        isCustom: ex.isCustom,
      })),
    });
  }, [routine, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
    keyName: "fieldKey",
  });

  const { ref: titleRef, ...titleRest } = register("title");

  const onSubmit = async (data: RoutineFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      await editUserRoutine(user.uid, routine.id, data);
      queryClient.invalidateQueries({ queryKey: ["routines", user.uid] });
      toast.success(t("success"));
      close();
    } catch (err: any) {
      toast.error(t("error"));
    }
  };

  return (
    <ModalWrapper
      modalType="routineEdit"
      title={t("edit.title")}>
      <div className="flex flex-col gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 space-y-2 mb-10 flex-col">
          <div className="flex flex-col flex-1 space-y-2 mb-10">
            <Controller
              name="color"
              control={control}
              render={({ field }) => {
                const currentValue = field.value || "";

                return (
                  <div className="space-y-2 py-2 mx-auto">
                    <div className="flex gap-3">
                      {colors.map((colorItem) => {
                        const isSelected = currentValue === colorItem;

                        return (
                          <div
                            key={colorItem}
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => {
                              field.onChange(colorItem);
                            }}
                            className={`h-10 w-10 cursor-pointer rounded-full transition-all duration-200 ${isSelected ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"}`}
                            style={{ backgroundColor: colorItem }}
                          />
                        );
                      })}
                    </div>
                    {errors.color?.message && <p className="text-sm text-red-500 text-center">{tForms(errors.color.message)}</p>}
                  </div>
                );
              }}
            />

            <Input
              ref={titleRef}
              input={{
                ...titleRest,
                id: "title",
                placeholder: t("name"),
                error: errors.title?.message && tForms(errors.title?.message),
              }}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("exercises")} ({fields.length})
              </label>

              <div className="space-y-2">
                {fields.map((field, index) => {
                  const groups = field.muscleGroup ? (field.muscleGroup.split(", ").filter(Boolean) as (typeof MUSCLE_GROUPS)[number][]) : [];

                  return (
                  <div
                    key={field.fieldKey}
                    className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                    <IconGridDots className="h-5 w-5 text-muted-foreground" />
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{getLocalizedText(field.name, locale)}</p>
                      <div className="text-xs text-muted-foreground flex gap-1">
                        {groups.map(group => <span>{tGroups(group.trim())}</span>)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Remove ${field.name}`}>
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                )
                })}

                {errors.exercises?.message && <p className="text-sm text-red-500">{tForms(errors.exercises.message)}</p>}

                <Button
                  variant="dashed"
                  type="button"
                  size="lg"
                  className="w-full"
                  onClick={() => setShowExercisePicker(true)}>
                  <IconPlus className="h-4 w-4" />
                  {t("addExercises")}
                </Button>
              </div>
            </div>

            {errors.root && <p className="text-sm text-red-500 mb-1">{errors.root.message}</p>}

            <Button
              type="submit"
              disabled={isSubmitting || !isDirty || !isValid}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg">
              {t("submit")}
            </Button>
          </div>

          {showExercisePicker && (
            <div className="absolute inset-0 z-10 flex flex-col rounded-t-3xl bg-card">
              <div className="flex items-center justify-between border-b border-border p-6">
                <h3 className="text-lg font-bold text-foreground">{t("picker.title")}</h3>
                <Button
                  onClick={() => setShowExercisePicker(false)}
                  variant="outline"
                  size="icon-lg"
                  aria-label="Close">
                  <IconX className="size-5" />
                </Button>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-6">
                {exercises.map((exercise) => {
                  const isSelected = fields.some((e) => e.exerciseId == exercise.id);

                  return (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      onClick={() => {
                        if (isSelected) return;
                        append({
                          exerciseId: exercise.id,
                          name: exercise.name,
                          muscleGroup: exercise.muscleGroup,
                          isCustom: exercise.isCustom,
                        });
                      }}
                      disabled={isSelected}
                      className="rounded-xl bg-secondary hover:bg-secondary/80"
                      trailing={isSelected && <span className="text-xs text-primary">{t("picker.added")}</span>}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </form>
      </div>
    </ModalWrapper>
  );
}
