"use client";
import { IconChevronDown, TablerIcon } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface SettingsSectionProps {
  label: string;
  icon?: TablerIcon;
  text: string;
  labelColor?: string;
  content: React.ReactNode;
}

export default function SettingsSection({ label, labelColor, icon, text, content }: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const IconComponent = icon;

  return (
    <div className="rounded-2xl bg-card">
      <div
        className="flex cursor-pointer items-center justify-between p-4 select-none"
        onClick={() => setIsOpen(!isOpen)}>
        <div>
          <div className={`flex items-center gap-2 font-bold ${labelColor}`}>
            {IconComponent && <IconComponent className="size-5 shrink-0" />}
            <span>{label}</span>
          </div>
          <div className="text-sm text-muted-foreground">{text}</div>
        </div>
        <div>
          <IconChevronDown
            className={`size-6 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="border-t-2 border-background"
            variants={{
              open: {
                opacity: 1,
                height: "auto",
                transition: {
                  opacity: { duration: 0.25, ease: "easeInOut", delay: 0.15 },
                  height: { duration: 0.25, ease: "easeInOut" },
                },
              },
              closed: {
                opacity: 0,
                height: 0,
                transition: {
                  opacity: { duration: 0.25, ease: "easeInOut" },
                  height: { duration: 0.25, ease: "easeInOut", delay: 0.15 },
                },
              },
            }}
            initial="closed"
            animate="open"
            exit="closed">
            <div className="flex w-full flex-col items-center gap-3 p-4">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
