"use client";

import { useEffect, useRef } from "react";
import { useTypewriter } from "@/app/hooks/useTypewriter";

type TypewriterTextProps = {
  text: string;
  speed?: number;
  className?: string;
  onRender?: () => void;
};

export function TypewriterText({
  text,
  speed = 10,
  className,
  onRender,
}: TypewriterTextProps) {
  const displayed = useTypewriter(text, speed);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!onRender) return;

    onRender();

    if (!ref.current) return;

    const observer = new ResizeObserver(() => {
      onRender();
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [text, onRender]);

  return (
    <p ref={ref} className={className}>
      {displayed}
    </p>
  );
}