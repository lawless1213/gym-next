"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function ConfirmEmail() {
  const t = useTranslations("settings.profile.email.confirm");
  const [isOpen, setIsOpen] = useState(false);
  const [isSend, setIsSend] = useState(false);

  const { user } = useAuth();
  const userId = user?.uid;

  const handleSubmitEmail = () => {
    toast.info(t("send"));
    setIsSend(true);
  };

  const handleCheckConfirm = () => {
    toast.success(t("success"));
  };

  return (
    <>
      <div className="text-sm text-muted-foreground">{t("description")}</div>
      {isSend ? (
        <Button onClick={() => handleCheckConfirm()}>{t("check")}</Button>
      ) : (
        <Button
          onClick={() => handleSubmitEmail()}
          className="m-auto">
          {t("submit")}
        </Button>
      )}
    </>
  );
}
