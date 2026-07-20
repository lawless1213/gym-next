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
import { ChipGroup } from "@/app/__components/form/chipGroup";
import { Select } from "@/app/__components/form/select";
import { generateAiRoutine } from "@/app/lib/actions/gemini/routine";

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

  const selectFields = [
    { name: "goal", placeholder: "Оберіть ціль", options: GOALS },
    { name: "difficulty", placeholder: "Оберіть рівень", options: DIFFICULTY },
    { name: "equipment", placeholder: "Оберіть Equipment", options: EQUIPMENT_GROUPS },
  ] as const;

  const onSubmit = async (data: RoutineAIFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");
      const result = await generateAiRoutine(data);

      console.log(result);

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

        <Controller
          name={"groups"}
          control={control}
          render={({ field }) => (
            <ChipGroup
              items={MUSCLE_GROUPS}
              value={field.value ?? []}
              onChange={field.onChange}
              id="groups"
              label="Muscle groups"
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
