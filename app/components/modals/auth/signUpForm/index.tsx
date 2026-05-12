"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/app/components/buttons/button";
import { useAuth } from "@/app/hooks/useAuth";
import { Input } from "@/app/components/form/input";

const signUpSchema = z.object({
  email: z.string().email("Введіть коректний email"),
  password: z.string().min(6, "Пароль має бути мінімум 6 символів"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validationResult = signUpSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const errors: Partial<Record<keyof SignUpFormData, string>> = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof SignUpFormData] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password);
      router.back();
    } catch (err: any) {
      setError(err.message ?? "Не вдалось зареєструватись. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignUp}
      className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4">
        <div className="w-full mb-2">
          <Input
            input={{
              placeholder: "Email",
              value: email,
              type: "email",
              onChange: (e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              },
              id: "email",
              name: "email",
              label: 'Email',
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
              label: "Password",
              error: fieldErrors.password,
            }}
          />
        </div>
      </div>

      {error && <p className="w-full text-sm text-red-500 mb-1">{error ?? "Не вдалось увійти. Спробуйте ще раз."}</p>}

      <Button
        type="submit"
        disabled={error ? true : !email || !password}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg">
        {isLoading ? "Sign up..." : "Sign up"}
      </Button>
    </form>
  );
}
