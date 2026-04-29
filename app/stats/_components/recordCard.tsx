"use client";

import { PersonalRecord } from "@/app/types";
import { IconTrophy } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function RecordCard({ record }: { record: PersonalRecord }) {
  const [isOpen, setIsOpen] = useState(false);
  const { exerciseName, date, weight, reps, prevWeight, prevReps } = record;
  const gain = prevWeight ? weight - prevWeight : null;
  const isNew = Date.now() - date.toDate().getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      aria-expanded={isOpen}
      className="bg-card rounded-2xl border border-white/5">
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          <IconTrophy className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate">{exerciseName}</span>
            {isNew && <span className="text-[10px] font-semibold bg-primary/15 text-primary rounded px-1.5 py-0.5 shrink-0">NEW</span>}
          </div>

          <span className="text-xs text-muted-foreground">{date.toDate().toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
        <span className="text-xl font-bold text-primary shrink-0">{weight}kg</span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="overflow-hidden flex border-t border-dashed border-muted-foreground/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}>
            <div className="flex-1 flex flex-col gap-0.5 p-3">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Поточний</span>
              <span className="text-sm font-semibold text-primary">
                {weight}kg × {reps}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-0.5 border-l border-dashed border-muted-foreground/20 p-3">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Попередній</span>
              <span className="text-sm font-semibold text-muted-foreground">{prevWeight ? `${prevWeight}kg × ${prevReps}` : "—"}</span>
            </div>

            <div className="flex-1 flex flex-col gap-0.5 border-l border-dashed border-muted-foreground/20 p-3">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Приріст</span>
              <span className="text-sm font-semibold text-primary">{gain ? `+${gain}kg` : "—"}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
