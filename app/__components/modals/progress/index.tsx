"use client";

import { ModalWrapper } from "../modal-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/__components/buttons/button";
import { Input } from "@/app/__components/form/input";
import { useModal } from "@/app/lib/modal/modal-store";
import { toast } from "sonner";
import { useAuth } from "@/app/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const progressSchema = z.object({
  date: z.date(),
  weight: z.number('Введіть будь ласка число.').positive('Показник не може бути відʼємним.').max(300).optional(),
  waist: z.number('Введіть будь ласка число.').positive('Показник не може бути відʼємним.').max(200).optional(),
  chest: z.number('Введіть будь ласка число.').positive('Показник не може бути відʼємним.').max(200).optional(),
  arms: z.number('Введіть будь ласка число.').positive('Показник не може бути відʼємним.').max(100).optional(),
  thighs: z.number('Введіть будь ласка число.').positive('Показник не може бути відʼємним.').max(150).optional(),
  notes: z.string().max(500).optional(),
}).refine(
  (data) => [data.weight, data.waist, data.chest, data.arms, data.thighs].some((v) => v !== undefined),
  { message: "Введіть хоча б один показник" }
);

type ProgressFormData = z.infer<typeof progressSchema>;

const FIELDS = [
  { name: "weight", placeholder: "Вага (кг)" },
  { name: "waist", placeholder: "Талія (см)" },
  { name: "chest", placeholder: "Груди (см)" },
  { name: "arms", placeholder: "Руки (см)" },
  { name: "thighs", placeholder: "Стегна (см)" },
] as const;

export function ProgressModal() {
  const { close } = useModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ProgressFormData>({
    resolver: zodResolver(progressSchema),
    mode: "onTouched",
    defaultValues: {
      date: new Date(),
    },
  });

  const onSubmit = async (data: ProgressFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["progress", user.uid] });
      toast.success("Показники збережено!");
      close();
    } catch (err: any) {
      console.error(err);
      toast.error("Щось пішло не так");
    }
  };

  return (
    <ModalWrapper modalType="progress" title="Your new measurements">
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          <div className="flex-1 space-y-2 mb-4">
            {FIELDS.map(({ name, placeholder }) => {
              const { ref, ...rest } = register(name, {
                setValueAs: (v) => (v === "" || v === undefined ? undefined : Number(v)),
              });
              return (
                <Input
                  key={name}
                  ref={ref}
                  input={{
                    ...rest,
                    type: "tel",
                    id: name,
                    placeholder,
                    error: errors[name]?.message,
                  }}
                />
              );
            })}

            <Input
              input={{
                ...register("notes"),
                type: "text",
                id: "notes",
                placeholder: "Нотатки (необов'язково)",
                error: errors.notes?.message,
              }}
            />
          </div>

          {errors.root?.message && (
            <p className="text-sm text-red-500 mb-2">{errors.root.message}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg">
            Save
          </Button>
        </form>
      </div>
    </ModalWrapper>
  );
}