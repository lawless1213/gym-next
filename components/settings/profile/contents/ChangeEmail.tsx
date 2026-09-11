"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/input";
import { useAuth } from "@/hooks/useAuth";
import { newEmailFormData, newEmailSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReauthModal } from "@/hooks/useModals/useReauthModal";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangeEmail() {
  const t = useTranslations("settings.profile.email.change");
  const tComponents = useTranslations("components");
  const { requestReauth } = useReauthModal();
  const { changeEmail } = useAuth();
  const { user } = useAuth();
  const userId = user?.uid;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<newEmailFormData>({
    resolver: zodResolver(newEmailSchema),
    mode: "onChange",
  });

  const { ref: emailRef, ...emailRest } = register("email");

  const onSubmit = (data: newEmailFormData) => {
    if (data.email === user?.email) {
      setError("email", {
        message: "email_same_as_current",
      });

      return;
    }

    requestReauth({
      title: t("confirmTitle"),
      description: t("confirmDescription"),
      onConfirm: async (currentPassword: string) => {
        await changeEmail(data.email, currentPassword);
        toast.success(t("emailChanged"));
        reset();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full">
      <Input
        ref={emailRef}
        input={{
          ...emailRest,
          id: "repeatPasswordInput",
          placeholder: t("placeholders.email"),
          error: errors.email?.message && tComponents("forms." + errors.email?.message),
        }}
      />
      <Button
        type="submit"
        disabled={isSubmitting || !isDirty || !isValid}
        className="w-full">
        {t("submit")}
      </Button>
    </form>
  );
}
