"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/__components/buttons/button";
import { useModal } from "@/app/lib/modal/modal-store";
import { toast } from "sonner";
import { useAuth } from "@/app/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { DIFFICULTY, EQUIPMENT_GROUPS, GOALS, MUSCLE_GROUPS } from "@/app/data/exercise";
import { TextArea } from "@/app/__components/form/textarea";
import { Input } from "@/app/__components/form/input";
import { ChipGroup } from "@/app/__components/form/chipGroup";
import { Select } from "@/app/__components/form/select";
import { generateAiRoutine } from "@/app/lib/actions/gemini/routine";
import RoutineCard from "@/app/__components/cards/routine";
import { createAiUserRoutine, createUserRoutine } from "@/app/lib/actions/routine";
import { useTranslations } from "next-intl";
import { TypewriterText } from "@/app/__components/common/TypewritterText";

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
  duration: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const num = Number(val);
        return !isNaN(num) && num > 0 && num <= 300;
      },
      { message: "Максимальна тривалість — 300 хвилин" },
    )
    .optional(),
  count: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const num = Number(val);
        return !isNaN(num) && num > 0 && num <= 20;
      },
      { message: "Максимальна кількість — 20" },
    )
    .optional(),
});

type RoutineAIFormData = z.infer<typeof routineSchema>;

export function AiRoutineContent() {
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

  const selectFields = [
    { name: "goal", placeholder: tFields("goals"), options: GOALS, key: "goals" },
    { name: "difficulty", placeholder: tFields("difficulty"), options: DIFFICULTY, key: "difficulty" },
    { name: "equipment", placeholder: tFields("equipmentGroups"), options: EQUIPMENT_GROUPS, key: "equipmentGroups" },
  ] as const;

  const onSubmit = async (formData: any) => {
    try {
      if (!user) throw new Error("Користувач не авторизований");

      const result = await generateAiRoutine({
        ...formData,
        userId: user.uid,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const speed = 15;
      const typingDuration = result.summary.length * speed;

      const ok = await confirm({
        title: result.data.name,
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
            <RoutineCard
              id="preview"
              {...result.data}
            />
          </div>
        ),
        cancelLabel: "Редагувати запит",
        confirmLabel: "Додати до бібліотеки",
      });

      if (ok) {
        await createAiUserRoutine(user.uid, {
          title: result.data.name,
          color: result.data.color,
          exercises: result.data.exercises,
        });

        queryClient.invalidateQueries({ queryKey: ["routines", user.uid] });
        queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });

        toast.success("Рутину та нові вправи успішно додано!");
        close();
      }
    } catch (error) {
      console.error(error);
      toast.error("Сталася помилка при створенні рутини.");
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

        <Controller
          name={"groups"}
          control={control}
          render={({ field }) => (
            <ChipGroup
              items={MUSCLE_GROUPS}
              value={field.value ?? []}
              onChange={field.onChange}
              id="groups"
              label={tFields("muscleGroups")}
              formatLabel={(item) => tComponents("muscleGroups." + item)}
              error={errors.groups?.message}
            />
          )}
        />

        <div className="flex items-center gap-2 w-full">
          <Input
            ref={durationRef}
            input={{
              ...durationRest,
              id: "duratio",
              placeholder: tFields("duration"),
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
              placeholder: tFields("exerciseCount"),
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
