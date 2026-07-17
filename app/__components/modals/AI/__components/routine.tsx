"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, z } from "zod";
import { Button } from "@/app/__components/buttons/button";
import { AUTH_ERRORS } from "@/app/lib/errors/auth";
import { useModal } from "@/app/lib/modal/modal-store";
import { IconBarbell, IconCheck, IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { createUserExercise } from "@/app/lib/actions/exercise";
import { useAuth } from "@/app/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { DIFFICULTY, EQUIPMENT_GROUPS, GOALS, MUSCLE_GROUPS } from "@/app/data/exercise";
import { Label } from "@/app/__components/form/label";
import { TextArea } from "@/app/__components/form/textarea";
import { Input } from "@/app/__components/form/input";

const routineSchema = z.object({
  comment: z.string().optional(),
  groups: z.array(z.string()).min(1, "Оберіть хоча б одну групу м'язів"),
  equipment: z.enum(EQUIPMENT_GROUPS, {
    message: "Оберіть обладнання",
  }),
  difficulty: z.enum(DIFFICULTY, {
    message: "Оберіть рівень",
  }),
  goal: z.enum(GOALS, {
    message: "Оберіть ціль",
  }),
  duration: z.string().optional(),
  count: z.string().optional(),
});

type RoutineAIFormData = z.infer<typeof routineSchema>;

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
  } = useForm<RoutineAIFormData>({
    resolver: zodResolver(routineSchema),
    mode: "onTouched",
    defaultValues: {
      groups: [],
      difficulty: "",
      equipment: "",
      goal: "",
    },
  });

  const { ref: commentRef, ...commentRest } = register("comment");
  const { ref: durationRef, ...durationRest } = register("duration");
  const { ref: countRef, ...countRest } = register("count");

  const onSubmit = async (data: RoutineAIFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");
			console.log(data);

      // await createUserExercise(user.uid, data);
      // queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
      // toast.success("Вправу успішно створено!");
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

        <div className="flex items-center gap-2 w-full">
          <Input
            ref={durationRef}
            input={{
              ...durationRest,
              id: "duratio",
              placeholder: "Тривалість",
              error: errors.duration?.message,
							type: "number",
							classes: "flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            }}
          />
          <Input
            ref={countRef}
            input={{
              ...countRest,
              id: "count",
              placeholder: "Кіл-кість вправ",
              error: errors.count?.message,
							type: "number",
							classes: "flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            }}
          />
        </div>

        <TextArea
          ref={commentRef}
          textarea={{
            ...commentRest,
            id: "comment",
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
