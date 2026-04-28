"use client";

import { IconBarbellFilled } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function LoadingScreen() {
  const t = useTranslations("app");
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.35, ease: "easeIn" }}>
      <div className="relative flex items-center justify-center mb-4">
        {[0, 0.5, 1].map((delay) => (
          <motion.div
            key={delay}
            className="absolute rounded-[18px] border border-primary"
            style={{ width: 64, height: 64 }}
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.6, opacity: 0 }}
            transition={{
              duration: 2.4,
              delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        <motion.div
          className="relative z-10 w-16 h-16 bg-primary rounded-[18px] flex items-center justify-center"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
          <IconBarbellFilled className="w-8 h-8 text-background" />
        </motion.div>
      </div>

      <motion.span
        className="text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}>
        <div className="text-2xl font-bold tracking-[4px]">{t("title")}</div>
        <div className="text-xs tracking-[2px] text-muted-foreground uppercase mt-1">{t("subtitle")}</div>
      </motion.span>
    </motion.div>
  );
}
