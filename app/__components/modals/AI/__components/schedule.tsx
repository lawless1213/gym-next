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
import { Select } from "@/app/__components/form/select";
import { ChipGroup } from "@/app/__components/form/chipGroup";
import { WeeklyCalendar } from "@/app/__components/weeklyCalendar";
import { useTypewriter } from "@/app/hooks/useTypewriter";
import { TypewriterText } from "@/app/__components/common/TypewritterText";

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
  dayPerWeek: z.string("Введіть кіл-кість днів тренувань"),
  splitType: z.enum(SPLIT_TYPES, {
    message: "Оберіть тип тренування",
  }),
  preferredRestDays: z.array(z.enum(weekDays)).optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

export function AiScheduleContent() {
  const { close, confirm } = useModal();
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

  const selectFields = [
    { name: "goal", placeholder: "Оберіть ціль", options: GOALS },
    { name: "difficulty", placeholder: "Оберіть рівень", options: DIFFICULTY },
    { name: "equipment", placeholder: "Оберіть Equipment", options: EQUIPMENT_GROUPS },
    { name: "splitType", placeholder: "Оберіть тип тренування", options: SPLIT_TYPES },
  ] as const;

  const chipFields = [
    { id: "groups", name: "groups", label: "Muscle groups", items: MUSCLE_GROUPS },
    { id: "preferredRestDays", name: "preferredRestDays", label: "Дні відпочинку", items: weekDays },
  ] as const;

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      const result = await generateAiSchedule(data);

      console.log(result);

      if (result.success) {
        const ok = await confirm({
          title: "Запровадити наступний графік занять?",
          description: <TypewriterText text={result.summary} />,
          children: <WeeklyCalendar schedule={result.data} />,
          cancelLabel: "Редагувати запит",
          confirmLabel: "Додати до бібліотеки",
        });

        if (ok) {
          // await createUserExercise(user.uid, {
          //   title: result.data.name,
          //   groups: [result.data.muscleGroup], // або split, якщо там кілька через кому
          //   description: result.data.description,
          // });
          // queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
          // toast.success("Вправу успішно додано до бази!");
          close();
        }
      }

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
        {selectFields.map(({ name, placeholder, options }) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field }) => (
              <Select
                input={{
                  id: name,
                  placeholder,
                  searchable: false,
                  value: field.value,
                  onChange: (value) => field.onChange(value),
                  error: errors[name]?.message,
                  options: options.map((opt) => ({ value: opt, label: opt })),
                }}
              />
            )}
          />
        ))}

        {chipFields.map(({ name, label, items }) => (
          <div key={name}>
            <Label label={{ text: label, for: name }} />
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <ChipGroup
                  items={items}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  error={errors[name]?.message}
                />
              )}
            />
          </div>
        ))}

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
