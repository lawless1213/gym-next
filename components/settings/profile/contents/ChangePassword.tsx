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

  // Основний обробник відправки форми після успішної валідації Zod
  const onSubmit = (data: newPassFormData) => {
    requestReauth({
      title: t("title"), // "Зміна пароля"
      description: t("reauthDescription"), // "Для підтвердження дії введіть свій поточний пароль"
      onConfirm: async (currentPassword: string) => {
        try {
          // Передаємо 1: новий пароль, 2: поточний пароль для реавтентифікації
          await changePassword(data.password, currentPassword);
          toast.success(t("passwordChanged"));
          reset(); // очищаємо форму після успіху
        } catch (err: any) {
          if (err?.code === "auth/same-global-password") {
            setError("password", {
              message: t("errors.samePassword"), // "Новий пароль не може збігатися зі старим"
            });
          } else {
            // Передаємо помилку далі, щоб ReauthModal зміг показати "Невірний поточний пароль"
            throw err; 
          }
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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