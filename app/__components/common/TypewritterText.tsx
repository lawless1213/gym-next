"use client";

import { useTypewriter } from "@/app/hooks/useTypewriter";

type TypewriterTextProps = {
  text: string;
  speed?: number;
  className?: string;
};

export function TypewriterText({ text, speed = 15, className }: TypewriterTextProps) {
  const displayed = useTypewriter(text, speed);
  return <p className={className}>{displayed}</p>;
}