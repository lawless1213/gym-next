"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { MouseEvent, ReactNode } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/__components/common/tooltip";
import { Button } from "./button";

type ButtonAddProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  icon?: ReactNode;
};

export default function ButtonAdd({ onClick, ariaLabel, icon = <IconPlus className="size-6" /> }: ButtonAddProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon-2xl"
          type="button"
          onClick={onClick}
          className="fixed bottom-16 left-4 z-40 shadow-lg hover:scale-105 active:scale-95"
          aria-label={ariaLabel}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{ariaLabel}</TooltipContent>
    </Tooltip>,
    document.body,
  );
}
