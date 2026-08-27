"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function ConfirmEmail() {
  const t = useTranslations("settings.profile.email.confirm");
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuth();
  const userId = user?.uid;

  const handleConfirmEmail = () => {
      toast.info(t("language.successChange"));
  };

  return (
    <>
      {isOpen ? (
        <>
          <div className="text-sm text-muted-foreground">{t("description")}</div>
          <Button className="m-auto">{t("confirm")}</Button>
        </>
      ) : (
        <Button onClick={() => setIsOpen(true)}>{t("confirm")}</Button>
      )}
    </>
  );
}
