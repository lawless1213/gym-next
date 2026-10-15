"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { IconChevronRight, IconMailExclamation, IconReload } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorCode } from "@/lib/errors/auth";

export default function ConfirmEmail() {
  const t = useTranslations("settings.profile.email.confirm");
  const tNotifications = useTranslations("notification.confirmEmail");
  const [isSend, setIsSend] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, sendVerificationEmail, checkEmailVerified } = useAuth();

  if (!user || user.emailVerified) {
    return null;
  }

  const handleSendEmail = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await sendVerificationEmail();
      toast.info(tNotifications("sent"));
      setIsSend(true);
    } catch (error) {
      if (getErrorCode(error) === "auth/too-many-requests") {
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
    } catch (error) {
      toast.error(tNotifications("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={!isSend ? handleSendEmail : undefined}
      className={`flex min-h-17 items-center justify-between gap-x-2 gap-y-4 rounded-2xl bg-warning/10 p-4 text-warning duration-200 select-none max-sm:flex-col ${!isSend && "cursor-pointer hover:text-foreground"}`}>
      <div className="flex flex-1 items-center gap-2 self-center">
        <IconMailExclamation className="shrink-0" />
        <div className="text-sm">{t("title")}</div>
        {!isSend && <IconChevronRight className="ml-auto shrink-0" />}
      </div>

      {isSend && (
        <div className="flex items-center gap-2 self-center">
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
