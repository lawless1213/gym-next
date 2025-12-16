"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/ui/buttons/button";
import { useAuth } from "@/app/hooks/useAuth";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      router.back();
    } catch (err: any) {
      setError(err.message ?? "Не вдалось увійти. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col items-center w-full gap-2">
      <div className="flex flex-col items-center w-full">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
      </div>

      {error && <p className="w-full text-sm text-red-500 mb-1">{error}</p>}

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
