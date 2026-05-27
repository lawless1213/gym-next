"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { MouseEvent } from "react";
import { IconPlus } from "@tabler/icons-react";

export default function buttonAdd({ onClick }: { onClick: (e: MouseEvent<HTMLButtonElement>) => void }) {
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
      aria-label="Create exercise">
      <IconPlus className="h-6 w-6" />
    </button>,
    document.body
  );
}
