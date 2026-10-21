"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { LogoMark, Wordmark } from "@/components/shared/Logo";

export default function LoadingScreen() {
  const t = useTranslations("app");
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.35, ease: "easeIn" }}>
      <div className="relative mb-6 flex items-center justify-center">
        {[0, 0.8].map((delay) => (
          <motion.div
            key={delay}
            className="absolute size-20 rounded-[22%] bg-volt"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.9], opacity: [0.35, 0] }}
            transition={{
              duration: 1.6,
              // Start pulsing once the mark has faded in.
              delay: delay + 0.4,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}>
          <LogoMark
            className="size-20"
            title={t("title")}
          />
        </motion.div>
      </div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        <Wordmark className="text-2xl" />
        <div className="mt-2 text-xs tracking-[2px] text-muted-foreground uppercase">{t("subtitle")}</div>
      </motion.div>
    </motion.div>
  );
}
