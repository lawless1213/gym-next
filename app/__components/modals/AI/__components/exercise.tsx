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
import { Select } from "@/app/__components/form/select";
import { ChipGroup } from "@/app/__components/form/chipGroup";
import { generateAiExercise } from "@/app/lib/actions/gemini/exercise";
import { ExerciseCard } from "@/app/__components/exerciseList";

const exerciseSchema = z.object({
  comment: z.string(),
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
});

type ExerciseAIFormData = z.infer<typeof exerciseSchema>;

export function AiExerciseContent() {
  const { close, confirm } = useModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ExerciseAIFormData>({
    resolver: zodResolver(exerciseSchema),
    mode: "onTouched",
    defaultValues: {
      groups: [],
      difficulty: "",
      equipment: "",
      goal: "",
    },
  });

  const { ref: commentRef, ...commentRest } = register("comment");

  const selectFields = [
    { name: "goal", placeholder: "Оберіть ціль", options: GOALS },
    { name: "difficulty", placeholder: "Оберіть рівень", options: DIFFICULTY },
    { name: "equipment", placeholder: "Оберіть Equipment", options: EQUIPMENT_GROUPS },
  ] as const;

  const onSubmit = async (data: ExerciseAIFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      const result = await generateAiExercise(data);

      if (result.success) {
        const ok = await confirm({
          title: result.data.name,
          description: result.summary,
          children: <ExerciseCard exercise={result.data} />,
          cancelLabel: "Редагувати запит",
          confirmLabel: "Додати до бібліотеки",
        });

        if (ok) {
          await createUserExercise(user.uid, {
            title: result.data.name,
            groups: [result.data.muscleGroup], // або split, якщо там кілька через кому
            description: result.data.description,
          });
          queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
          toast.success("Вправу успішно додано до бази!");
          close();
        }
      }

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
