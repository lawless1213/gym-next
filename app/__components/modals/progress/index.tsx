"use client";

import { ModalWrapper } from "../modal-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/input";
import { useModal } from "@/app/lib/modal/modal-store";
import { toast } from "sonner";
import { useAuth } from "@/app/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { addUserProgress } from "@/app/lib/actions/progress";
import { useTranslations } from "next-intl";

const progressSchema = z.object({
  date: z.date(),
  weight: z.number('Введіть будь ласка число.').positive('Показник не може бути відʼємним.').max(300).optional(),
  waist: z.number('Введіть будь ласка число.').positive('Показник не може бути відʼємним.').max(200).optional(),
  chest: z.number('Введіть будь ласка число.').positive('Показник не може бути відʼємним.').max(200).optional(),
  arms: z.number('Введіть будь ласка число.').positive('Показник не може бути відʼємним.').max(100).optional(),
  thighs: z.number('Введіть будь ласка число.').positive('Показник не може бути відʼємним.').max(150).optional(),
}).refine(
  (data) => [data.weight, data.waist, data.chest, data.arms, data.thighs].some((v) => v !== undefined),
  { message: "Введіть хоча б один показник" }
);

type ProgressFormData = z.infer<typeof progressSchema>;

export function ProgressModal() {
  const tComponents = useTranslations("components");
  const t = useTranslations("measurements.modal");

  const { close } = useModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const FIELDS = [
    { name: "weight", placeholder: `${t('fields.weight')} (${tComponents('measurement.kg')})` },
    { name: "waist", placeholder: `${t('fields.waist')} (${tComponents('measurement.cm')})` },
    { name: "chest", placeholder: `${t('fields.chest')} (${tComponents('measurement.cm')})` },
    { name: "arms", placeholder: `${t('fields.arms')} (${tComponents('measurement.cm')})` },
    { name: "thighs", placeholder: `${t('fields.thighs')} (${tComponents('measurement.cm')})` }
  ] as const;

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
      await addUserProgress(user.uid, data);
      queryClient.invalidateQueries({ queryKey: ["lastProgress"] });
      toast.success(t('success'));
      close();
    } catch (err: any) {
      toast.error(t("error"));
    }
  };

  return (
    <ModalWrapper modalType="progress" title={t('title')}>
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
          </div>

          {errors.root?.message && (
            <p className="text-sm text-red-500 mb-2">{errors.root.message}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg">
            {t("fields.submit")}
          </Button>
        </form>
      </div>
    </ModalWrapper>
  );
}