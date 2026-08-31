"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/input";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePassword() {
  const t = useTranslations("settings.profile.password");
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuth();
  const userId = user?.uid;

   const handleSubmitPassword = () => {
    toast.success(t("passwordChanged"));
  };

  return (
    <>
      <Input
        input={{
          id: "changePasswordInput",
          placeholder: t("placeholders.change"),
          type: "text",
          autoComplete: "off",
        }}
      />
      <Input
        input={{
          id: "repeatPasswordInput",
          placeholder: t("placeholders.repeat"),
          type: "text",
          autoComplete: "off",
        }}
      />
      <Button onClick={() => handleSubmitPassword()}>{t("submit")}</Button>
    </>
  );
}
