"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/input";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangeEmail() {
  const t = useTranslations("settings.profile.email.change");
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuth();
  const userId = user?.uid;

  const handleSubmitEmail = () => {
    toast.success(t("emailChanged"));
  };

  return (
    <>
      <Input
        input={{
          id: "changeEmailInput",
          placeholder: t("placeholders.email"),
          type: "text",
          autoComplete: "off",
        }}
      />
      <Button
        onClick={() => handleSubmitEmail()}
        className="m-auto">
        {t("submit")}
      </Button>
    </>
  );
}
