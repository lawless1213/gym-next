"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/__components/buttons/button";
import { Input } from "@/app/__components/form/input";
import { useModal } from "@/app/lib/modal/modal-store";
import { toast } from "sonner";
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
import { TypewriterText } from "@/app/__components/common/TypewritterText";
import { createAiUserSchedule } from "@/app/lib/actions/shedule";
import { useTranslations } from "next-intl";

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
  splitType: z.enum(SPLIT_TYPES, {
    message: "Оберіть тип тренування",
  }),
  preferredRestDays: z.array(z.enum(weekDays)).optional(),
  dayPerWeek: z.string().refine((val) => {
    if (!val) return true;
    const num = Number(val);
    return !isNaN(num) && num > 0 && num <= 7;
  }, { message: "Максимальна кількість — 7" }),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

export function AiScheduleContent() {
  const tComponents = useTranslations("components");
  const tFields = useTranslations("ai.modal.fields");

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
    { name: "goal", placeholder: tFields("goals"), options: GOALS, key: "goals" },
    { name: "difficulty", placeholder: tFields("difficulty"), options: DIFFICULTY, key: "difficulty" },
    { name: "equipment", placeholder: tFields("equipmentGroups"), options: EQUIPMENT_GROUPS, key: "equipmentGroups" },
    { name: "splitType", placeholder: tFields("splitTypes"), options: SPLIT_TYPES, key: "splitTypes"},
  ] as const;

  const chipFields = [
    { id: "groups", name: "groups", label: tFields("muscleGroups"), items: MUSCLE_GROUPS, key: "muscleGroups"},
    { id: "preferredRestDays", name: "preferredRestDays", label: tFields("restDays"), items: weekDays, key: "day.default"},
  ] as const;

  const onSubmit = async (formData: ScheduleFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");
  
      const result = await generateAiSchedule({ ...formData, userId: user.uid });
  
      if (!result.success) {
        setError("root", { message: result.error });
        return;
      }
  
      const ok = await confirm({
        title: "Запровадити наступний графік занять?",
        description: <TypewriterText text={result.summary} />,
        children: <WeeklyCalendar schedule={result.data} />,
        cancelLabel: "Редагувати запит",
        confirmLabel: "Додати до бібліотеки",
      });
  
      if (!ok) return;
  
      const saveResult = await createAiUserSchedule(user.uid, result.data);
  
      if (!saveResult.success) {
        toast.error(saveResult.error);
        return;
      }
  
      queryClient.invalidateQueries({ queryKey: ["schedule", user.uid] });
      queryClient.invalidateQueries({ queryKey: ["routines", user.uid] });
      queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
  
      toast.success("Графік та нові рутини успішно додано!");
      close();
    } catch (error) {
      console.error(error);
      toast.error("Сталася помилка при створенні графіку.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 flex-col static">
      <div className="flex-1 space-y-6 mb-10">
        {selectFields.map(({ name, placeholder, options, key }) => (
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
                  options: options.map((opt) => ({ value: opt, label: tComponents(`${key}.${opt}`) })),
                }}
              />
            )}
          />
        ))}

        {chipFields.map(({ name, label, items, key }) => (
          <div key={name}>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <ChipGroup
                  items={items}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  label={label}
                  formatLabel={(item) => tComponents(`${key}.${item}`)}
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
            id: "dayPerWeek",
            placeholder: tFields("daysCount"),
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
            placeholder: tFields("additionalComment"),
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
        {tFields("submit")}
      </Button>
    </form>
  );
}
