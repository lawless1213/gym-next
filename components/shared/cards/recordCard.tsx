"use client";

import { getLocalizedText } from "@/lib/utils";
import { useUserPreferences } from "@/providers/user-preferences-provider";
import { PersonalRecord } from "@/types";
import { IconTrophy } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { Locale } from "@/types/common";

export default function RecordCard({ record }: { record: PersonalRecord }) {
  const { params } = useUserPreferences();
  const locale = useLocale();
  const t = useTranslations("stats.records.card");
  const tMeasurement = useTranslations("components.measurement");
  const [isOpen, setIsOpen] = useState(false);
  const { exerciseName, date, weight, reps, prevWeight, prevReps } = record;
  const gain = prevWeight ? weight - prevWeight : null;
  // Lazy initial state keeps render pure (Date.now is read once, on mount).
  const [isNew] = useState(() => Date.now() - date.toDate().getTime() < 7 * 24 * 60 * 60 * 1000);
  const title = getLocalizedText(exerciseName, locale as Locale);

  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      aria-expanded={isOpen}
      className="rounded-2xl border border-white/5 bg-card">
      <div className="flex items-center gap-3 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
          <IconTrophy className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">{title}</span>
            {isNew && (
              <span className="shrink-0 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {t("new")}
              </span>
            )}
          </div>

          <span className="text-xs text-muted-foreground">
            {date.toDate().toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <span className="shrink-0 text-xl font-bold text-primary tabular-nums">
          {weight + tMeasurement(params.weight)}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="flex overflow-hidden border-t border-dashed border-muted-foreground/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}>
            <div className="flex flex-1 flex-col gap-0.5 p-3">
              <span className="text-[10px] tracking-wide text-muted-foreground uppercase">{t("current")}</span>
              <span className="text-sm font-semibold text-primary">
                {weight + tMeasurement(params.weight)} × {reps}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-0.5 border-l border-dashed border-muted-foreground/20 p-3">
              <span className="text-[10px] tracking-wide text-muted-foreground uppercase">{t("previous")}</span>
              <span className="text-sm font-semibold text-muted-foreground">
                {prevWeight ? `${prevWeight + tMeasurement(params.weight)} × ${prevReps}` : "—"}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-0.5 border-l border-dashed border-muted-foreground/20 p-3">
              <span className="text-[10px] tracking-wide text-muted-foreground uppercase">{t("growth")}</span>
              <span className="text-sm font-semibold text-primary">
                {gain ? `+${gain + tMeasurement(params.weight)}` : "—"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
