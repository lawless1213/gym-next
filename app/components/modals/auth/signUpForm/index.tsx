"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/components/buttons/button";
import { useAuth } from "@/app/hooks/useAuth";
import { Input } from "@/app/components/form/input";
import { AUTH_ERRORS } from "@/app/lib/errors/auth";
import { useModal } from "@/app/lib/modal/modal-store";

const signUpSchema = z.object({
  email: z.string().email("Введіть коректний email"),
  password: z.string().min(6, "Пароль має бути мінімум 6 символів"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const { close } = useModal();
  const { signup } = useAuth();

   const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });

  const { ref: emailRef, ...emailRest } = register("email");
  const { ref: passwordRef, ...passwordRest } = register("password");

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signup(data.email, data.password);
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
            placeholder: "Email",
            // label: "Email",
            error: errors.email?.message,
          }}
        />
        <Input
          ref={passwordRef}
          input={{
            ...passwordRest,
            id: "password",
            type: "password",
            placeholder: "Password",
            // label: "Password",
            error: errors.password?.message,
          }}
        />
      </div>

      {errors.root && <p className="text-sm text-red-500 mb-1">{errors.root.message}</p>}

      <Button
        type="submit"
        disabled={isSubmitting || !isDirty || !isValid}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg">
        {isSubmitting ? "Sign up..." : "Sign up"}
      </Button>
    </form>
  );
}
