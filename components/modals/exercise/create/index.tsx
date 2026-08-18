"use client";

import { ModalWrapper } from "../../modal-wrapper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/input";
import { useModal } from "@/components/modals/modal-store";
import { IconBarbell, IconCheck, IconUpload } from "@tabler/icons-react";
import { toast } from "sonner";
import { createUserExercise } from "@/lib/actions/exercise";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { MUSCLE_GROUPS } from "@/data/exercise";
import { useTranslations } from "next-intl";
import { ChipGroup } from "@/components/ui/form/chipGroup";
import { ExerciseFormData, exerciseSchema } from "@/lib/schemas";

export function ExerciseCreateModal() {
  const tComponents = useTranslations("components");
  const t = useTranslations("exercise.modal");
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
      groups: [],
    },
  });

  const { ref: titleRef, ...titleRest } = register("title");
  const { ref: descriptionRef, ...descriptionRest } = register("description");

  const onSubmit = async (data: ExerciseFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      await createUserExercise(user.uid, data);
      queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
      toast.success(t("success"));
      close();
    } catch (err: any) {
      toast.error(t("error"));
    }
  };

  return (
    <ModalWrapper
      modalType="exercise"
      title={t("create.title")}>
      <div className="flex flex-col gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col static">
          <div className="flex-1 space-y-2 mb-10">
            <Controller
              name="photo"
              control={control}
              render={({ field: { onChange, value } }) => {
                const previewUrl = value ? URL.createObjectURL(value) : null;

                return (
                  <label className="group flex flex-col items-center cursor-pointer">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-secondary overflow-hidden">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <IconBarbell className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onChange(e.target.files?.[0])}
                    />
                    <span className="flex items-center gap-2 text-sm font-medium group-hover:text-primary mt-1 transition-[0.2s]">
                      <IconUpload className="h-4 w-4" />
                      {value ? t("changePicture") : t("addPicture")}
                    </span>
                    {errors.photo?.message && <p className="text-xs text-red-500 min-h-5">{errors.photo?.message}</p>}
                  </label>
                );
              }}
            />

            <Input
              ref={titleRef}
              input={{
                ...titleRest,
                id: "title",
                placeholder: t("name"),
                error: errors.title?.message && tComponents('forms.' + errors.title?.message),
              }}
            />

            <Input
              ref={descriptionRef}
              input={{
                ...descriptionRest,
                id: "description",
                placeholder: t("describe"),
                error: errors.description?.message && tComponents('forms.' + errors.description?.message),
              }}
            />

            <Controller
              name={"groups"}
              control={control}
              render={({ field }) => (
                <ChipGroup
                  items={MUSCLE_GROUPS}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  id="groups"
                  label={t("muscleGroups")}
                  formatLabel={(item) => tComponents("muscleGroups." + item)}
                  error={errors.groups?.message && tComponents('forms.' + errors.groups?.message)}
                />
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isDirty || !isValid}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg">
            {t("submit")}
          </Button>
        </form>
      </div>
    </ModalWrapper>
  );
}
