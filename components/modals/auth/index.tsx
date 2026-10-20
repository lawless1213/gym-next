"use client";

import { useState } from "react";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import LoginWith from "./LoginWith";
import { ModalWrapper } from "../ModalWrapper";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function AuthModal() {
  const t = useTranslations("auth");
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <ModalWrapper
      modalType="auth"
      title={isSignUp ? t("modal.registerTab") : t("modal.loginTab")}>
      <div className="flex flex-col gap-4">
        {isSignUp ? <SignUpForm /> : <LoginForm />}

        <Button
          variant="link"
          className="cursor-pointer self-start text-xs text-zinc-400 hover:underline"
          onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? t("modal.alreadyHaveAccount") : t("modal.dontHaveAccount")}
        </Button>
        <div className="h-0.5 w-full bg-muted-foreground opacity-10"></div>
        <LoginWith />
      </div>
    </ModalWrapper>
  );
}
