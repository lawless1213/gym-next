"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/app/ui/buttons/button";
import { useAuth } from "@/app/hooks/useAuth";
import { Input } from "@/app/ui/form/input";
import { AUTH_ERRORS } from "@/app/lib/errors/auth";

const loginSchema = z.object({
  email: z.string().email("Введіть коректний email"),
  password: z.string().min(6, "Пароль має бути мінімум 6 символів"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const errors: Partial<Record<keyof LoginFormData, string>> = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof LoginFormData] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      router.back();
    } catch (err: any) {
      const message = AUTH_ERRORS[err.code] || AUTH_ERRORS["default"];
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col items-center w-full gap-2">
      <div className="flex flex-col items-center w-full">
        <div className="w-full mb-2">
          <Input
            input={{
              placeholder: "Email",
              value: email,
              // type: "email",
              onChange: (e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              },
              id: "email",
              name: "email",
              error: fieldErrors.email,
            }}
          />
        </div>
        <div className="w-full mb-2">
          <Input
            input={{
              placeholder: "Password",
              value: password,
              type: "password",
              onChange: (e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              },
              id: "password",
              name: "password",
              error: fieldErrors.password,
            }}
          />
        </div>
      </div>

      {error && <p className="w-full text-sm text-red-500 mb-1">{error ?? "Не вдалось увійти. Спробуйте ще раз."}</p>}
      

      <Button
        button={{
          label: isLoading ? "Logging in..." : "Login",
          big: true,
          type: "submit",
          disabled: isLoading,
        }}
      />
    </form>
  );
}
