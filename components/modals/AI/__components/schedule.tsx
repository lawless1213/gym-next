"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/input";
import { useModal } from  "@/components/modals/modal-store";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { DIFFICULTY, EQUIPMENT_GROUPS, GOALS, MUSCLE_GROUPS, SPLIT_TYPES } from "@/data/exercise";
import { Label } from "@/components/ui/form/label";
import { TextArea } from "@/components/ui/form/textarea";
import { weekDays } from "@/types";
import { generateAiSchedule } from "@/lib/actions/gemini/schedule";
import { Select } from "@/components/ui/form/select";
import { ChipGroup } from "@/components/ui/form/chipGroup";
import { WeeklyCalendar } from "@/components/shared/WeeklyCalendar";
import { TypewriterText } from "@/components/ui/TypewritterText";
import { createAiUserSchedule } from "@/lib/actions/shedule";
import { useLocale, useTranslations } from "next-intl";
import { AIScheduleFormData, AIScheduleSchema } from "@/lib/schemas";

export function AiScheduleContent() {
  const locale = useLocale();

  const t = useTranslations("ai.modal");
  const tComponents = useTranslations("components");

  const { close, confirm } = useModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<AIScheduleFormData>({
    resolver: zodResolver(AIScheduleSchema),
    mode: "onChange",
    defaultValues: {
      groups: [],
    },
  });

  const { ref: commentRef, ...commentRest } = register("comment");
  const { ref: dayPerWeekRef, ...dayPerWeekRest } = register("dayPerWeek");

  const selectFields = [
    { name: "goal", placeholder: t("fields.goals"), options: GOALS, key: "goals" },
    { name: "difficulty", placeholder: t("fields.difficulty"), options: DIFFICULTY, key: "difficulty" },
    { name: "equipment", placeholder: t("fields.equipmentGroups"), options: EQUIPMENT_GROUPS, key: "equipmentGroups" },
    { name: "splitType", placeholder: t("fields.splitTypes"), options: SPLIT_TYPES, key: "splitTypes" },
  ] as const;

  const chipFields = [
    { id: "groups", name: "groups", label: t("fields.muscleGroups"), items: MUSCLE_GROUPS, key: "muscleGroups" },
    { id: "preferredRestDays", name: "preferredRestDays", label: t("fields.restDays"), items: weekDays, key: "day.default" },
  ] as const;

  const onSubmit = async (formData: AIScheduleFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

  const locale = useLocale();
      const result = await generateAiSchedule({ ...formData, userId: user.uid, locale });

      if (!result.success) {
        setError("root", { message: result.error });
        return;
      }

      const speed = 15;
      const typingDuration = result.summary.length * speed;

      const ok = await confirm({
        title: "Запровадити наступний графік занять?",
        description: (
          <TypewriterText
            text={result.summary}
            speed={speed}
          />
        ),
        children: (
          <div
            className="animate-fade-in"
            style={{
              animationDelay: `${typingDuration}ms`,
              animationFillMode: "forwards",
            }}>
            <WeeklyCalendar schedule={result.data} />
          </div>
        ),
        cancelLabel: t('confirm.cancel'),
        confirmLabel: t('confirm.confirm'),
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
                  error: errors[name]?.message && tComponents(`forms.${errors[name].message}`),
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
                  error={errors[name]?.message && tComponents(`forms.${errors[name].message}`)}
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
            placeholder: t("fields.daysCount"),
            error: errors.dayPerWeek?.message && tComponents("forms." + errors.dayPerWeek?.message),
            type: "number",
          }}
        />
        <TextArea
          ref={commentRef}
          textarea={{
            ...commentRest,
            id: "comment",
            placeholder: t("fields.additionalComment"),
            error: errors.comment?.message && tComponents("forms." + errors.comment?.message),
          }}
        />
      </div>

      {errors.root && <p className="text-sm text-red-500 mb-1">{errors.root.message}</p>}

      <Button
        type="submit"
        disabled={isSubmitting || !isDirty || !isValid}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg">
        {t("fields.submit")}
      </Button>
    </form>
  );
}
