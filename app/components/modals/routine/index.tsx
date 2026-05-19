"use client";

import { ModalWrapper } from "../modal-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/components/buttons/button";
import { useAuth } from "@/app/hooks/useAuth";
import { Input } from "@/app/components/form/input";
import { AUTH_ERRORS } from "@/app/lib/errors/auth";
import { useModal } from "@/app/lib/modal/modal-store";
import { IconBarbell, IconGridDots, IconPlus, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Exercise } from "@/app/types";
import { useAllExercises } from "@/app/hooks/useServices/useExercises";

const colors = ["#CCFF00", "#2563EB", "#F97316", "#EF4444", "#8B5CF6", "#10B981"];

const routineSchema = z.object({
  title: z.string().min(3, "Назва має бути мінімум 3 символа"),
});

type RoutineFormData = z.infer<typeof routineSchema>;

export function RoutineCreateModal() {
  const { user } = useAuth();
  const userID = user?.uid;
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const { close } = useModal();

  const handleAddExercise = (exercise: Exercise) => {
    if (!selectedExercises.find((e) => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
    setShowExercisePicker(false);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter((e) => e.id !== exerciseId));
  };

  const { data: exercises = [], isLoading: loading } = useAllExercises(userID);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<RoutineFormData>({
    resolver: zodResolver(routineSchema),
    mode: "onTouched",
  });

  const { ref: titleRef, ...titleRest } = register("title");

  const onSubmit = async (data: RoutineFormData) => {
    try {
      console.log(data);

      // close();
    } catch (err: any) {
      setError("root", {
        message: AUTH_ERRORS[err.code] ?? AUTH_ERRORS["default"],
      });
    }
  };

  return (
    <ModalWrapper
      modalType="routine"
      title={"routine"}>
      <div className="flex flex-col gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col">
          <div className="flex-1 space-y-2 mb-10">
            <Input
              ref={titleRef}
              input={{
                ...titleRest,
                id: "title",
                placeholder: "e.g., Push Day",
                // label: "title",
                error: errors.title?.message,
              }}
            />
            {/* Color */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Color</label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-10 w-10 rounded-full transition-all ${selectedColor === color ? "ring-2 ring-foreground ring-offset-2 ring-offset-card" : ""}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
            {/* Selected Exercises */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Exercises ({selectedExercises.length})</label>
              <div className="space-y-2">
                {selectedExercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                    <IconGridDots className="h-5 w-5 text-muted-foreground" />
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground">{exercise.muscleGroup}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(exercise.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Remove ${exercise.name}`}>
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Add Exercise Button */}
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

          {/* Exercise Picker */}
        {showExercisePicker && (
          <div className="absolute inset-0 z-10 flex flex-col rounded-t-3xl bg-card">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h3 className="text-lg font-bold text-foreground">Select Exercise</h3>
              <button
                onClick={() => setShowExercisePicker(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-6">
              {exercises.map((exercise) => {
                const isSelected = selectedExercises.some((e) => e.id === exercise.id);
                return (
                  <button
                    key={exercise.id}
                    onClick={() => !isSelected && handleAddExercise(exercise)}
                    disabled={isSelected}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-primary/10 opacity-50'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">{exercise.muscleGroup}</p>
                    </div>
                    {isSelected && (
                      <span className="text-xs font-medium text-primary">Added</span>
                    )}
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
