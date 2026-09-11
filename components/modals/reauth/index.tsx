"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/input";
import { ModalWrapper } from "../modal-wrapper";
import { reauthSchema, ReauthFormData } from "@/lib/schemas/reauth.schema";
import { useReauthModal } from "@/hooks/useModals/useReauthModal";

export function ReauthModal() {
  const tComponents = useTranslations("components");
  const t = useTranslations("reauth");
  
  // Отримуємо дані з нашого хука
  const { close, title, description, onSuccess } = useReauthModal();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ReauthFormData>({
    resolver: zodResolver(reauthSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  });

  const { ref: passwordRef, ...passwordRest } = register("password");

  const onSubmit = async (data: ReauthFormData) => {
    try {
      if (onSuccess) {
        await onSuccess(data.password);
      }
      reset();
      close();
    } catch (err: any) {
      const wrongPasswordCodes = [
        "auth/wrong-password",
        "auth/invalid-credential",
        "auth/invalid-password",
      ];

      if (wrongPasswordCodes.includes(err?.code)) {
        setError("password", { message: "wrong_password" });
      } else {
        setError("password", { message: "error_occurred" });
      }
    }
  };

  return (
    <ModalWrapper
      modalType="reauth"
      title={title || t("modal.title")}
    >
      <div className="flex flex-col gap-4">
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input
            ref={passwordRef}
            input={{
              ...passwordRest,
              type: "password",
              id: "currentPassword",
              placeholder: t("fields.password"),
              error:
                errors.password?.message &&
                tComponents("forms." + errors.password?.message),
            }}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={isSubmitting}
            >
              {t("modal.cancel")}
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? t("modal.confirming") : t("modal.confirm")}
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}