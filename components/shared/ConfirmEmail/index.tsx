"use client";

import { Button } from "@/components/ui/Button"; // перевірте шлях до кнопки
import { useAuth } from "@/hooks/useAuth";
import { IconChevronRight, IconMailExclamation, IconReload } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function ConfirmEmail() {
  const t = useTranslations("settings.profile.email.confirm");
  const tNotifications = useTranslations("notification.confirmEmail");
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
      toast.info(tNotifications("sent"));
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
      className={`flex gap-x-2 gap-y-4 p-4 min-h-17 items-center justify-between bg-warning/10 text-warning rounded-2xl duration-200 select-none max-sm:flex-col ${!isSend && "hover:text-foreground cursor-pointer"}`}>
      <div className="flex gap-2 self-center items-center flex-1">
        <IconMailExclamation className="shrink-0" />
        <div className="text-sm">{t("title")}</div>{!isSend && <IconChevronRight className="ml-auto shrink-0" />}
      </div>

      {isSend && (
        <div className="flex gap-2 items-center self-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSendEmail}>
            <IconReload stroke={2} />
          </Button>
          <Button
            disabled={loading}
            onClick={handleCheckConfirm}>
            {t("check")}
          </Button>
        </div>
      )}
    </div>
  );
}
