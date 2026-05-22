"use client";

import { ModalWrapper } from "../modal-wrapper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/components/buttons/button";
import { Input } from "@/app/components/form/input";
import { AUTH_ERRORS } from "@/app/lib/errors/auth";
import { useModal } from "@/app/lib/modal/modal-store";
import { IconBarbell, IconCheck, IconUpload } from "@tabler/icons-react";
import { useState } from "react";

const exerciseSchema = z.object({
  photo: z.instanceof(File).optional(),
  title: z.string().min(3, "Назва має бути мінімум 3 символа"),
  groups: z.array(z.string()).min(1, "Оберіть хоча б одну групу м'язів"),
  description: z.string(),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Full Body"];

export function ExerciseCreateModal() {
  const { close } = useModal();

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
      console.log(data);
      close();
    } catch (err: any) {
      setError("root", {
        message: AUTH_ERRORS[err.code] ?? AUTH_ERRORS["default"],
      });
    }
  };

  return (
    <ModalWrapper
      modalType="exercise"
      title={"New exercise"}>
      <div className="flex flex-col gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col">
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
                      {value ? "Change Photo" : "Add Photo"}
                    </span>
                  </label>
                );
              }}
            />

            <Input
              ref={titleRef}
              input={{
                ...titleRest,
                id: "title",
                placeholder: "e.g., Incline Dumbbell Press",
                // label: "title",
                error: errors.title?.message,
              }}
            />

            <Input
              ref={descriptionRef}
              input={{
                ...descriptionRest,
                id: "description",
                placeholder: "Describe the exercise...",
                // label: "description",
                error: errors.description?.message,
              }}
            />

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
      </div>
    </ModalWrapper>
  );
}
