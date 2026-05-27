"use client";

import { ModalWrapper } from "../modal-wrapper";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/__components/buttons/button";
import { useAuth } from "@/app/hooks/useAuth";
import { Input } from "@/app/__components/form/input";
import { AUTH_ERRORS } from "@/app/lib/errors/auth";
import { useModal } from "@/app/lib/modal/modal-store";
import { IconGridDots, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { RoutinesExercise } from "@/app/types";
import { useAllExercises } from "@/app/hooks/useServices/useExercises";
import { toast } from "sonner";
import { createUserRoutine } from "@/app/lib/actions/routine";
import { useQueryClient } from "@tanstack/react-query";

const colors = ["#CCFF00", "#2563EB", "#F97316", "#EF4444", "#8B5CF6", "#10B981"];

const routineSchema = z.object({
  title: z.string().min(3, "Назва має бути мінімум 3 символа"),
  color: z.string().min(1, "Оберіть колір"),
  exercises: z.array(z.custom<RoutinesExercise>()).min(1, "Додайте хоча б одну вправу"),
});

type RoutineFormData = z.infer<typeof routineSchema>;

export function RoutineCreateModal() {
  const { user } = useAuth();
  const userID = user?.uid;
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const { close } = useModal();
  const queryClient = useQueryClient();

  const { data: exercises = [], isLoading: loading } = useAllExercises(userID);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<RoutineFormData>({
    resolver: zodResolver(routineSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      color: colors[0],
      exercises: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const { ref: titleRef, ...titleRest } = register("title");

  const onSubmit = async (data: RoutineFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      await createUserRoutine(user.uid, data);
      queryClient.invalidateQueries({ queryKey: ["routines", user.uid] });
      toast.success('Програму успішно створено!');
      close();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <ModalWrapper
      modalType="routine"
      title={"Create routine"}>
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
                          <button
                            key={colorItem}
                            type="button"
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
                    {errors.color && <p className="text-sm text-red-500 text-center">{errors.color.message}</p>}
                  </div>
                );
              }}
            />

            <Input
              ref={titleRef}
              input={{
                ...titleRest,
                id: "title",
                placeholder: "e.g., Push Day",
                error: errors.title?.message,
              }}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Exercises ({fields.length})</label>

              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                    <IconGridDots className="h-5 w-5 text-muted-foreground" />
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{field.name}</p>
                      <p className="text-xs text-muted-foreground">{field.muscleGroup}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Remove ${field.name}`}>
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {errors.exercises && <p className="text-sm text-red-500">{errors.exercises.message}</p>}

                <button
                  type="button"
                  onClick={() => setShowExercisePicker(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                  <IconPlus className="h-4 w-4" />
                  Add Exercise
                </button>
              </div>
            </div>

            {errors.root && <p className="text-sm text-red-500 mb-1">{errors.root.message}</p>}

            <Button
              type="submit"
              disabled={isSubmitting || !isDirty || !isValid}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg">
              Create
            </Button>
          </div>

          {showExercisePicker && (
            <div className="absolute inset-0 z-10 flex flex-col rounded-t-3xl bg-card">
              <div className="flex items-center justify-between border-b border-border p-6">
                <h3 className="text-lg font-bold text-foreground">Select Exercise</h3>
                <button
                  type="button"
                  onClick={() => setShowExercisePicker(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground">
                  <IconX className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-6">
                {exercises.map((exercise) => {
                  const isSelected = fields.some((e) => e.exerciseId == exercise.id);

                  return (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) return;
                        append({
                          exerciseId: exercise.id,
                          name: exercise.name,
                          muscleGroup: exercise.muscleGroup,
                          isCustom: exercise.isCustom,
                        });
                        setShowExercisePicker(false);
                      }}
                      disabled={isSelected}
                      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${isSelected ? "bg-muted/40 opacity-40 cursor-not-allowed select-none" : "bg-secondary hover:bg-secondary/80 cursor-pointer"}`}>
                      <div className="flex-1">
                        <p className={`font-medium ${isSelected ? "text-muted-foreground" : "text-foreground"}`}>{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">{exercise.muscleGroup}</p>
                      </div>
                      {isSelected && <span className="text-xs font-medium text-primary">Added</span>}
                    </button>
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
