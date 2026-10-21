"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "@/components/modals/ModalProvider";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { IconBrandGithubFilled, IconBrandGoogleFilled } from "@tabler/icons-react";
import { authErrorKey, getErrorCode } from "@/lib/errors/auth";
import { useTranslations } from "next-intl";

export default function LoginWith() {
  const t = useTranslations("auth");
  const { close } = useModal();
  const { loginWithGoogle, loginWithGithub } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleProviderLogin = async (loginFn: () => Promise<void>) => {
    try {
      setLoading(true);
      await loginFn();
      toast.success(t("login.success"));
      close();
    } catch (error) {
      const code = getErrorCode(error);
      if (code === "auth/popup-closed-by-user") return;

      const key = authErrorKey(error);
      toast.error(key === "default" ? t("errors.loginFailed") : t(`errors.${key}`));
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
