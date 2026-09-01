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
    <div className="bg-card rounded-2xl">
      <div
        className="p-4 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <div className={`font-bold flex items-center gap-2 ${labelColor}`}>
            {IconComponent && <IconComponent className="size-5 shrink-0" />}
            <span>{label}</span>
          </div>
          <div className="text-sm text-muted-foreground">{text}</div>
        </div>
        <div>
          <IconChevronDown
            className={`text-muted-foreground size-6 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="overflow-hidden border-t-2 border-background"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="p-4 flex flex-col gap-3 items-center">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}