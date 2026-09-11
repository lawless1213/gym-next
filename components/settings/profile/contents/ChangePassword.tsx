"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/input";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { newPassFormData, newPassSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReauthModal } from "@/hooks/useModals/useReauthModal";

export default function ChangePassword() {
  const t = useTranslations("settings.profile.password");
  const tComponents = useTranslations("components");
  const { requestReauth } = useReauthModal();
  const { changePassword } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<newPassFormData>({
    resolver: zodResolver(newPassSchema),
    mode: "onChange",
  });

  const { ref: passwordRef, ...passwordRest } = register("password");
  const { ref: confirmPasswordRef, ...confirmPasswordRest } = register("confirmPassword");

 const onSubmit = (data: newPassFormData) => {
  requestReauth({
    title: t("confirmTitle"),
    description: t("confirmDescription"),
    onConfirm: async (currentPassword: string) => {
      if (data.password === currentPassword) {
        setError("password", {
          message: "same_as_current",
        });
        
        return; 
      }

      await changePassword(data.password, currentPassword);
      toast.success(t("passwordChanged"));
      reset();
    },
  });
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <Input
        ref={passwordRef}
        input={{
          ...passwordRest,
          id: "changePasswordInput",
          placeholder: t("placeholders.change"),
          type: "password",
          autoComplete: "new-password",
          error: errors.password?.message && tComponents("forms." + errors.password?.message),
        }}
      />

      <Input
        ref={confirmPasswordRef}
        input={{
          ...confirmPasswordRest,
          id: "repeatPasswordInput",
          placeholder: t("placeholders.repeat"),
          type: "password",
          autoComplete: "new-password",
          error: errors.confirmPassword?.message && tComponents("forms." + errors.confirmPassword?.message),
        }}
      />

      <Button
        type="submit"
        disabled={isSubmitting || !isDirty || !isValid}
        className="w-full"
      >
        {t("submit")}
      </Button>
    </form>
  );
}