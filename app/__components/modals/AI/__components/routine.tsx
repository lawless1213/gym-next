"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/__components/buttons/button";
import { Input } from "@/app/__components/form/input";
import { AUTH_ERRORS } from "@/app/lib/errors/auth";
import { useModal } from "@/app/lib/modal/modal-store";
import { IconBarbell, IconCheck, IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { createUserExercise } from "@/app/lib/actions/exercise";
import { useAuth } from "@/app/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const exerciseSchema = z.object({
  photo: z.instanceof(File).optional(),
  title: z.string().min(3, "Назва має бути мінімум 3 символа"),
  groups: z.array(z.string()).min(1, "Оберіть хоча б одну групу м'язів"),
  description: z.string(),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Full Body"];

export function AiRoutineContent() {
  const { close } = useModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    mode: "onTouched",
    defaultValues: {
      groups: [],
    },
  });

  const { ref: titleRef, ...titleRest } = register("title");
  const { ref: descriptionRef, ...descriptionRest } = register("description");

  const onSubmit = async (data: ExerciseFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      await createUserExercise(user.uid, data);
      queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
      toast.success("Вправу успішно створено!");
      close();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 flex-col static">
      <div className="flex-1 space-y-2 mb-10">
				<h3>Routine</h3>
        <Input
          ref={titleRef}
          input={{
            ...titleRest,
            id: "title",
            placeholder: "e.g., Incline Dumbbell Press",
            // label: "title",
            error: errors.title?.message,
          }}
        />
        <Input
          ref={descriptionRef}
          input={{
            ...descriptionRest,
            id: "description",
            placeholder: "Describe the exercise...",
            // label: "description",
            error: errors.description?.message,
          }}
        />

        <Controller
          name="groups"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map((group) => {
                  const checked = field.value.includes(group);
                  return (
                    <button
                      key={group}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => {
                        const next = checked ? field.value.filter((g) => g !== group) : [...field.value, group];
                        field.onChange(next);
                      }}
                      className={`cursor-pointer flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${checked ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                      {group}
                    </button>
                  );
                })}
              </div>
              {errors.groups && <p className="text-sm text-red-500">{errors.groups.message}</p>}
            </div>
          )}
        />
      </div>

      {errors.root && <p className="text-sm text-red-500 mb-1">{errors.root.message}</p>}

      <Button
        type="submit"
        disabled={isSubmitting || !isDirty || !isValid}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg">
        Create
      </Button>
    </form>
  );
}
