"use client";

import { ModalWrapper } from "../ModalWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/Input";
import { useModal } from "@/components/modals/ModalProvider";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { addUserProgress } from "@/lib/mutations/progress";
import { useTranslations } from "next-intl";
import { ProgressFormData, progressSchema } from "@/lib/schemas";
import { useUserPreferences } from "@/providers/UserPreferencesProvider";

export function ProgressModal() {
  const { params } = useUserPreferences();
  const tComponents = useTranslations("components");
  const t = useTranslations("measurements.modal");

  const { close } = useModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const FIELDS = [
    { name: "weight", placeholder: `${t("fields.weight")} (${tComponents(`measurement.${params.weight}`)})` },
    { name: "waist", placeholder: `${t("fields.waist")} (${tComponents(`measurement.${params.distance}`)})` },
    { name: "chest", placeholder: `${t("fields.chest")} (${tComponents(`measurement.${params.distance}`)})` },
    { name: "arms", placeholder: `${t("fields.arms")} (${tComponents(`measurement.${params.distance}`)})` },
    { name: "thighs", placeholder: `${t("fields.thighs")} (${tComponents(`measurement.${params.distance}`)})` },
  ] as const;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProgressFormData>({
    resolver: zodResolver(progressSchema),
    mode: "onChange",
    defaultValues: {
      date: new Date(),
    },
  });

  const onSubmit = async (data: ProgressFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");
      await addUserProgress(user.uid, data);
      queryClient.invalidateQueries({ queryKey: ["lastProgress"] });
      toast.success(t("success"));
      close();
    } catch (err) {
      toast.error(t("error"));
    }
  };

  return (
    <ModalWrapper
      modalType="progress"
      title={t("title")}>
      <div className="flex flex-col gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col">
          <div className="mb-4 flex-1 space-y-2">
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
                    error: errors[name]?.message && tComponents("forms." + errors[name]?.message),
                  }}
                />
              );
            })}
          </div>

          {errors.root?.message && <p className="mb-2 text-sm text-red-500">{errors.root.message}</p>}

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
