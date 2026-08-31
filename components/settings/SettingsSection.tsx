"use client";
import { IconChevronDown } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface SettingsSectionProps {
  label: string;
  text: string;
  content: React.ReactNode;
}

export default function SettingsSection({ label, text, content }: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card rounded-2xl">
      <div
        className="p-4 flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}>
        <div className="">
          <div className="font-bold text-primary uppercase">{label}</div>
          <div className="text-sm text-muted-foreground">{text}</div>
        </div>
        <div>
          <IconChevronDown className={`text-muted-foreground size-6 duration-200 ${isOpen && "rotate-x-180"}`} />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="overflow-hidden border-t-2 border-background"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}>
            <div className="p-4 flex flex-col gap-3 items-center">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
