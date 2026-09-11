"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/lib/config/firebaseConfig";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { useModal } from "@/components/modals/modal-store";

export default function AuthActionPage() {
  const t = useTranslations("auth.page");
  const { open } = useModal();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (!oobCode || mode !== "verifyAndChangeEmail") {
      setStatus("error");
      return;
    }

    const verifyEmailChange = async () => {
      try {
        await applyActionCode(auth, oobCode);

        if (auth.currentUser) {
          await auth.signOut();
        }

        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    verifyEmailChange();
  }, [mode, oobCode]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center ">
        <p>{t("confirming")}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-xl font-bold text-error">{t("confirmingError")}</h1>
        <p>{t("linkOld")}</p>
        <Button onClick={() => open("auth")}>{t("login")}</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold text-success">{t("confirmingSuccess")}</h1>
      <p>{t("repeatLogin")}</p>
      <Button onClick={() => open("auth")}>{t("login")}</Button>
    </div>
  );
}
