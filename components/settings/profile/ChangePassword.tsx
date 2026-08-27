"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/input";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ChangePassword() {
  const t = useTranslations("settings.profile.password");
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuth();
  const userId = user?.uid;

  return (
    <>
      {isOpen ? (
        <>
          <Input
            input={{
              id: "chatInput",
              placeholder: t("placeholder"),
              type: "text",
              autoComplete: "off",
            }}
          />
					<Input
            input={{
              id: "chatInput",
              placeholder: t("placeholder"),
              type: "text",
              autoComplete: "off",
            }}
          />
          <Button>{t("confirm")}</Button>
        </>
      ) : (
        <Button onClick={() => setIsOpen(true)}>{t("confirm")}</Button>
      )}
    </>
  );
}
