"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { MouseEvent, ReactNode } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { Button } from "../ui/Button";
import { useAuth } from "@/hooks/useAuth";

type ButtonAddProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  ariaLabelVerify: string;
  icon?: ReactNode;
};

export default function ButtonAdd({ onClick, ariaLabel, ariaLabelVerify, icon = <IconPlus className="size-6" /> }: ButtonAddProps) {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user || !mounted) return null;

  return createPortal(
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon-2xl"
          type="button"
          onClick={user.emailVerified ? onClick : () => {return true}}
          className={`fixed bottom-20 left-4 z-40 shadow-lg ${user.emailVerified ? 'hover:scale-105 active:scale-95' : 'cursor-auto brightness-50 hover:brightness-50 '}`}
          aria-label={user.emailVerified ? ariaLabel : ariaLabelVerify}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{user.emailVerified ? ariaLabel : ariaLabelVerify}</TooltipContent>
    </Tooltip>,
    document.body,
  );
}
