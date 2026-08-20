"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/form/input";
import { AUTH_ERRORS } from "@/lib/errors/auth";
import { useModal } from  "@/components/modals/modal-store";
import { useTranslations } from "next-intl";
import { AuthFormData, authSchema } from "@/lib/schemas";

export default function LoginForm() {
  const t = useTranslations("auth");
  const tForms = useTranslations("components.forms");
  const { close } = useModal();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
  });

  const { ref: emailRef, ...emailRest } = register("email");
  const { ref: passwordRef, ...passwordRest } = register("password");

  const onSubmit = async (data: AuthFormData) => {
    try {
      await login(data.email, data.password);
      close();
    } catch (err: any) {
      setError("root", {
        message: AUTH_ERRORS[err.code] ?? AUTH_ERRORS["default"],
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 flex-col">
      <div className="flex-1 space-y-2 mb-10">
        <Input
          ref={emailRef}
          input={{
            ...emailRest,
            id: "email",
            placeholder: t("fields.email"),
            error: errors.email?.message && tForms(errors.email?.message),
          }}
        />
        <Input
          ref={passwordRef}
          input={{
            ...passwordRest,
            id: "password",
            type: "password",
            placeholder: t("fields.password"),
            error: errors.password?.message && tForms(errors.password?.message),
          }}
        />
      </div>

      {errors.root && <p className="text-sm text-red-500 mb-1">{errors.root.message}</p>}

      <Button
        type="submit"
        disabled={isSubmitting || !isDirty || !isValid}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg">
        {isSubmitting ? t("login.submitting") : t("login.submit")}
      </Button>
    </form>
  );
}
