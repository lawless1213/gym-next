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
import { DIFFICULTY, EQUIPMENT_GROUPS, GOALS, MUSCLE_GROUPS, SPLIT_TYPES } from "@/app/data/exercise";
import { Label } from "@/app/__components/form/label";
import { TextArea } from "@/app/__components/form/textarea";
import { weekDays } from "@/app/types";
import { generateAiSchedule } from "@/app/lib/actions/gemini/schedule";

const scheduleSchema = z.object({
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
  dayPerWeek: z.string( "Введіть кіл-кість днів тренувань"),
  splitType: z.enum(SPLIT_TYPES, {
    message: "Оберіть тип тренування",
  }),
  preferredRestDays: z.array(z.enum(weekDays)).optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

export function AiScheduleContent() {
  const { close } = useModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    mode: "onTouched",
    defaultValues: {
      groups: [],
    },
  });

  const { ref: commentRef, ...commentRest } = register("comment");
  const { ref: dayPerWeekRef, ...dayPerWeekRest } = register("dayPerWeek");

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      const result = await generateAiSchedule(data);

      console.log(result);

      if (!result.success) {
        setError("root", { message: result.error });
        return;
      }

      // await createUserExercise(user.uid, data);
      // queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
      toast.success("Графік успішно створено!");
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

        <Label label={{ text: "Тип тренування", for: "splitType" }} />
        <Controller
          name="splitType"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Level">
                {SPLIT_TYPES.map((type) => {
                  const selected = field.value === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.onChange(type)}
                      className={`cursor-pointer flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                      {type}
                    </button>
                  );
                })}
              </div>
              {errors.equipment && <p className="text-sm text-red-500">{errors.equipment.message}</p>}
            </div>
          )}
        />

        <Input
          ref={dayPerWeekRef}
          input={{
            ...dayPerWeekRest,
            id: "duratio",
            placeholder: " Кіл-кість тренувальних днів",
            error: errors.dayPerWeek?.message,
            type: "number",
            classes: "flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          }}
        />

        <Label label={{ text: "Дні відпочинку", for: "preferredRestDays" }} />
        <Controller
          name="preferredRestDays"
          control={control}
          render={({ field }) => {
            const valueArray: string[] = Array.isArray(field.value) ? field.value : [];
            return (
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-2">
                  {weekDays.map((day) => {
                    const checked = valueArray.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        onClick={() => {
                          let next: string[];
                          if (checked) {
                            next = valueArray.filter((g) => g !== day);
                          } else {
                            next = [...valueArray, day];
                          }
                          field.onChange(next);
                        }}
                        className={`cursor-pointer flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${checked ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                        {day}
                      </button>
                    );
                  })}
                </div>
                {errors.preferredRestDays && <p className="text-sm text-red-500">{errors.preferredRestDays.message}</p>}
              </div>
            );
          }}
        />

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
