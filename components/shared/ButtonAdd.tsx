"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { MouseEvent, ReactNode } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { Button } from "../ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type ButtonAddProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  icon?: ReactNode;
};

export default function ButtonAdd({ onClick, ariaLabel, icon = <IconPlus className="size-6" /> }: ButtonAddProps) {
  const tNotification = useTranslations("notification");

  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user || !mounted) return null;

  const isVerified = user.emailVerified;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isVerified) {
      toast.warning(tNotification("verifyRequiredWarning"));
      return;
    }

    onClick(event);
  };

  return createPortal(
    <Button
      size="icon-2xl"
      type="button"
      onClick={handleClick}
      aria-disabled={!isVerified}
      aria-label={isVerified ? ariaLabel : tNotification("verifyRequiredWarning")}
      className="fixed bottom-20 left-4 z-40 shadow-lg hover:scale-105 active:scale-95">
      {icon}
    </Button>,
    document.body,
  );
}
