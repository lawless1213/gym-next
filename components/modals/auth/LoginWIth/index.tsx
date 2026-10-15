"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "@/components/modals/modal-store";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { IconBrandGithubFilled, IconBrandGoogleFilled } from "@tabler/icons-react";
import { getErrorCode } from "@/lib/errors/auth";

export default function LoginWith() {
  const { close } = useModal();
  const { loginWithGoogle, loginWithGithub } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleProviderLogin = async (loginFn: () => Promise<void>) => {
    try {
      setLoading(true);
      await loginFn();
      toast.success("Успішний вхід!");
      close();
    } catch (error) {
      const code = getErrorCode(error);
      if (code === "auth/popup-closed-by-user") return;

      if (code === "auth/account-exists-with-different-credential") {
        toast.error("Ця пошта вже прив'язана до іншого способу входу (наприклад, Google).");
        return;
      }

      toast.error("Не вдалося увійти. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full justify-center gap-4">
      <Button
        variant="secondary"
        size="icon-2xl"
        disabled={loading}
        onClick={() => handleProviderLogin(loginWithGoogle)}>
        <IconBrandGoogleFilled className="size-7" />
      </Button>
      <Button
        disabled={loading}
        variant="secondary"
        size="icon-2xl"
        onClick={() => handleProviderLogin(loginWithGithub)}>
        <IconBrandGithubFilled className="size-7" />
      </Button>
    </div>
  );
}
