"use client";

import { Button } from "@/components/ui/Button"; // перевірте шлях до кнопки
import { useAuth } from "@/hooks/useAuth";
import { IconChevronRight, IconMailExclamation } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function ConfirmEmail() {
  const t = useTranslations("settings.profile.email.confirm");
  const tNotifications = useTranslations("notification.confirmEmail.send");
  const [isSend, setIsSend] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, sendVerificationEmail, checkEmailVerified } = useAuth();

  if (!user || user.emailVerified) {
    return null;
  }

  // Обробник надсилання листа
  const handleSendEmail = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await sendVerificationEmail();
      toast.info(tNotifications("send"));
      setIsSend(true);
    } catch (error: any) {
      if (error.code === "auth/too-many-requests") {
        setIsSend(true);
        toast.info(tNotifications("wasSent"));
      } else {
        toast.error(tNotifications("error"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);
      const isVerified = await checkEmailVerified();

      if (isVerified) {
        toast.success(tNotifications("success"));
      } else {
        toast.warning(tNotifications("notConfirmed"));
      }
    } catch (error: any) {
      toast.error(tNotifications("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={!isSend ? handleSendEmail : undefined}
      className="flex gap-2 p-4 items-center bg-warning/10 text-warning rounded-2xl cursor-pointer hover:text-foreground duration-200 select-none">
      <IconMailExclamation className="shrink-0" />
      <div className="text-sm">{t("title")}</div>

      {isSend ? (
        <Button
          disabled={loading}
          onClick={handleCheckConfirm}
          className="ml-auto">
          {t("check")}
        </Button>
      ) : (
        <IconChevronRight className="ml-auto shrink-0" />
      )}
    </div>
  );
}
