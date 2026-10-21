"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/form/Textarea";
import { useModal } from "@/components/modals/ModalProvider";
import { toast } from "sonner";
import { createUserExercise } from "@/lib/mutations/exercise";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { DIFFICULTY, EQUIPMENT_GROUPS, GOALS, MUSCLE_GROUPS } from "@/data/exercise";
import { Select } from "@/components/ui/form/Select";
import { ChipGroup } from "@/components/ui/form/ChipGroup";
import { generateAiExercise } from "@/lib/server/actions/ai/exercise";
import { ExerciseCard } from "@/components/shared/cards/ExerciseCard";
import { useLocale, useTranslations } from "next-intl";
import { useAiErrorMessage } from "@/hooks/useAiErrorMessage";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { AIExerciseFormData, AIExerciseSchema } from "@/lib/schemas";
import { getLocalizedText, type Locale } from "@/types/common";

export function AiExerciseContent() {
  const locale = useLocale() as Locale;
  const tComponents = useTranslations("components");
  const t = useTranslations("ai.modal");
  const aiErrorMessage = useAiErrorMessage();
  const { close, confirm } = useModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<AIExerciseFormData>({
    resolver: zodResolver(AIExerciseSchema),
    mode: "onChange",
    defaultValues: {
      groups: [],
      difficulty: "",
      equipment: "",
      goal: "",
    },
  });

  const { ref: commentRef, ...commentRest } = register("comment");

  const selectFields = [
    { name: "goal", placeholder: t("fields.goals"), options: GOALS, key: "goals" },
    { name: "difficulty", placeholder: t("fields.difficulty"), options: DIFFICULTY, key: "difficulty" },
    { name: "equipment", placeholder: t("fields.equipmentGroups"), options: EQUIPMENT_GROUPS, key: "equipmentGroups" },
  ] as const;

  const onSubmit = async (data: AIExerciseFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      const idToken = await user.getIdToken();
      const result = await generateAiExercise({ ...data, idToken, locale });

      if (!result.success) {
        toast.error(aiErrorMessage(result.error));
        return;
      }

      const speed = 15;
      const typingDuration = result.summary.length * speed;

      const ok = await confirm({
        title: getLocalizedText(result.data.name, locale),
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
            <ExerciseCard exercise={result.data} />
          </div>
        ),
        cancelLabel: t("confirm.cancel"),
        confirmLabel: t("confirm.confirm"),
      });

      if (ok) {
        await createUserExercise(user.uid, {
          title: result.data.name,
          groups: [result.data.muscleGroup],
          description: result.data.description,
        });
        queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
        toast.success(t("success"));
        close();
      }
    } catch (err) {
      toast.error(t("error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="static flex flex-1 flex-col">
      <div className="mb-10 flex-1 space-y-6">
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

        <Controller
          name={"groups"}
          control={control}
          render={({ field }) => (
            <ChipGroup
              items={MUSCLE_GROUPS}
              value={field.value ?? []}
              onChange={field.onChange}
              id="groups"
              label={t("fields.muscleGroups")}
              formatLabel={(item) => tComponents("muscleGroups." + item)}
              error={errors.groups?.message && tComponents("forms." + errors.groups?.message)}
            />
          )}
        />

        <TextArea
          ref={commentRef}
          textarea={{
            ...commentRest,
            id: "title",
            placeholder: t("fields.additionalComment"),
            error: errors.comment?.message && tComponents("forms." + errors.comment?.message),
          }}
        />
      </div>

      {errors.root && <p className="mb-1 text-sm text-red-500">{errors.root.message}</p>}

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
