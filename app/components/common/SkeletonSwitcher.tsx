"use client";

import { AnimatePresence, motion, MotionProps } from "motion/react";
import { ReactNode } from "react";

interface SkeletonSwitcherProps {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  contentKey?: string;
  animationProps?: MotionProps;
  fluid?: boolean;
}

const defaultAnimation: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: "easeInOut" },
};

export default function SkeletonSwitcher({
  isLoading,
  skeleton,
  children,
  contentKey = "content",
  animationProps = defaultAnimation,
  fluid
}: SkeletonSwitcherProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          {...animationProps}
          className={fluid ? "w-full" : ""}
     
        >
          {skeleton}
        </motion.div>
      ) : (
        <motion.div
          key={contentKey}
          {...animationProps}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}