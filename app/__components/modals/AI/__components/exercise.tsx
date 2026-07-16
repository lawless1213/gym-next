"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/__components/buttons/button";
import { TextArea } from "@/app/__components/form/textarea";
import { AUTH_ERRORS } from "@/app/lib/errors/auth";
import { useModal } from "@/app/lib/modal/modal-store";
import { IconBarbell, IconCheck, IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { createUserExercise } from "@/app/lib/actions/exercise";
import { useAuth } from "@/app/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "@/app/__components/form/label";
import { DIFFICULTY, EQUIPMENT_GROUPS, GOALS, MUSCLE_GROUPS } from "@/app/data/exercise";

const exerciseSchema = z.object({
  comment: z.string(),
  groups: z.enum(MUSCLE_GROUPS, {
    message: "Оберіть  групу м'язів",
  }),
  equipment: z.enum(EQUIPMENT_GROUPS, {
    message: "Оберіть обладнання",
  }),
  difficulty: z.enum(DIFFICULTY, {
    message: "Оберіть рівень",
  }),
  goal: z.enum(GOALS, {
    message: "Оберіть ціль",
  }),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

export function AiExerciseContent() {
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
      groups: "",
      difficulty: "",
      equipment: "",
			goal: "",
    },
  });

  const { ref: commentRef, ...commentRest } = register("comment");

  const onSubmit = async (data: ExerciseFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      // await createUserExercise(user.uid, data);
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
      <div className="flex-1 space-y-6 mb-10">
        <Label label={{ text: "Ціль", for: "goal" }} />
        <Controller
          name="goal"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Goal">
                {GOALS.map((goal) => {
                  const selected = field.value === goal;
                  return (
                    <button
                      key={goal}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.onChange(goal)}
                      className={`cursor-pointer flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                      {goal}
                    </button>
                  );
                })}
              </div>
              {errors.goal && <p className="text-sm text-red-500">{errors.goal.message}</p>}
            </div>
          )}
        />

        <Label label={{ text: "Level", for: "difficulty" }} />
        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Level">
                {DIFFICULTY.map((level) => {
                  const selected = field.value === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.onChange(level)}
                      className={`cursor-pointer flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                      {level}
                    </button>
                  );
                })}
              </div>
              {errors.difficulty && <p className="text-sm text-red-500">{errors.difficulty.message}</p>}
            </div>
          )}
        />

        <Label label={{ text: "Muscle groups", for: "groups" }} />
        <Controller
          name="groups"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="groups">
                {MUSCLE_GROUPS.map((group) => {
                  const selected = field.value === group;
                  return (
                    <button
                      key={group}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.onChange(group)}
                      className={`cursor-pointer flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                      {group}
                    </button>
                  );
                })}
              </div>
              {errors.equipment && <p className="text-sm text-red-500">{errors.equipment.message}</p>}
            </div>
          )}
        />

        <Label label={{ text: "Equipment", for: "equipment" }} />
        <Controller
          name="equipment"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Level">
                {EQUIPMENT_GROUPS.map((equipment) => {
                  const selected = field.value === equipment;
                  return (
                    <button
                      key={equipment}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.onChange(equipment)}
                      className={`cursor-pointer flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                      {equipment}
                    </button>
                  );
                })}
              </div>
              {errors.equipment && <p className="text-sm text-red-500">{errors.equipment.message}</p>}
            </div>
          )}
        />

        <TextArea
          ref={commentRef}
          textarea={{
            ...commentRest,
            id: "title",
            placeholder: "Додатковий коментар",
            error: errors.comment?.message,
          }}
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
