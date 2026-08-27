"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/input";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ChangeEmail() {
  const t = useTranslations("settings.profile.email.change");
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
          <Button className="m-auto">{t("confirm")}</Button>
        </>
      ) : (
        <Button onClick={() => setIsOpen(true)}>{t("confirm")}</Button>
      )}
    </>
  );
}
