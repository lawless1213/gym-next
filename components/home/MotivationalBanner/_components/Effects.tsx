"use client";

import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Counts from 0 to `target` once (and again when the target changes). Instant with reduced motion. */
export function useCountUp(target: number, duration = 0.8): number {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration: reduceMotion ? 0 : duration,
      ease: EASE_OUT,
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [target, duration, reduceMotion]);

  // Whole numbers while counting, the exact value at the end (e.g. 102.5 kg).
  return value === target ? target : Math.round(value);
}

/** Horizontal bar that grows to `ratio` (0–1) on mount. */
export function GrowingBar({ ratio, className, delay = 0 }: { ratio: number; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  const width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  return (
    <motion.div
      className={className}
      initial={{ width: reduceMotion ? width : 0 }}
      animate={{ width }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
    />
  );
}

/** One light sweep across the card, like a glint on a medal. */
export function Shine() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/60 to-transparent"
      initial={{ x: "-150%" }}
      animate={{ x: "400%" }}
      transition={{ duration: 1.1, delay: 0.5, ease: "easeInOut" }}
    />
  );
}

/** Big faint icon cut off by the card's corner. */
export function Watermark({ icon: Icon, className }: { icon: React.ElementType; className?: string }) {
  return (
    <Icon
      aria-hidden
      stroke={1.5}
      className={`pointer-events-none absolute -right-6 -bottom-8 size-40 -rotate-12 ${className ?? ""}`}
    />
  );
}

const SEEN_PREFIX = "nf-banner-record:";
const PARTICLES = 28;

/** Deterministic 0–1 noise so particles don't need Math.random during render. */
const noise = (i: number, seed: number) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Confetti burst the first time this device sees a given record (`recordKey`).
 * Skipped with reduced motion or when storage is unavailable.
 */
export function RecordConfetti({ recordKey, colors }: { recordKey: string; colors: string[] }) {
  const reduceMotion = useReducedMotion();
  // Read-only initialiser: the "seen" mark is written in the effect below.
  const [firstTime] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(SEEN_PREFIX + recordKey) === null;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(SEEN_PREFIX + recordKey, "1");
    } catch {
      // Private mode / blocked storage: just no confetti next time either.
    }
  }, [recordKey]);

  if (!firstTime || reduceMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0">
      {Array.from({ length: PARTICLES }, (_, i) => {
        const angle = (i / PARTICLES) * Math.PI * 2 + noise(i, 1);
        const distance = 70 + noise(i, 2) * 110;
        const size = 5 + Math.round(noise(i, 3) * 5);
        return (
          <motion.span
            key={i}
            className="absolute top-1/3 left-1/2 block rounded-[2px]"
            style={{ width: size, height: size * 0.6, background: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: [0, Math.sin(angle) * distance * 0.7, Math.sin(angle) * distance * 0.7 + 60],
              opacity: [1, 1, 0],
              rotate: noise(i, 4) * 540 - 270,
              scale: 1,
            }}
            transition={{ duration: 1.4, delay: 0.35, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
