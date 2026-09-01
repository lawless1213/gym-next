"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { IconChevronRight, IconMailExclamation } from "@tabler/icons-react";
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
    <div onClick={() => handleCheckConfirm()} className="flex gap-2 p-4 items-center bg-warning/10 text-warning rounded-2xl cursor-pointer hover:text-foreground duration-200">
      <IconMailExclamation/>
      <div className="text-sm">{t("title")}</div>
      {isSend ? (
        <Button >{t("check")}</Button>
      ) : (
        <IconChevronRight className="ml-auto"/>
      )}
    </div>
  );
}
