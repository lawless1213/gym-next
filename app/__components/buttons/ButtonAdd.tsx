"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { MouseEvent, ReactNode } from "react";
import { IconPlus } from "@tabler/icons-react";

type ButtonAddProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  icon?: ReactNode;
};

export default function ButtonAdd({ onClick, ariaLabel, icon = <IconPlus className="h-6 w-6" /> }: ButtonAddProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95"
      aria-label={ariaLabel}>
      {icon}
    </button>,
    document.body
  );
}