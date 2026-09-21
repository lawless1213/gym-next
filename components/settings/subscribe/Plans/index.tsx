"use client";

import { useState } from "react";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { PlanId } from "@/types/subscribe";
import { DEFAULT_PLANS } from "@/data/subscribe";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export default function Plans() {
  const t = useTranslations(`settings.subscribe.plans`);
  const [selectedId, setSelectedId] = useState<PlanId>("yearly");
  const [pending, setPending] = useState(false);

  const selected = DEFAULT_PLANS.find((p) => p.id === selectedId) ?? DEFAULT_PLANS[0];

  async function handleSubscribe() {
    if (pending) return;
    setPending(true);
    try {
      console.log(selected.id);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div
        role="radiogroup"
        aria-label="Оберіть план"
        className="mt-6 flex max-md:flex-col gap-3">
        {DEFAULT_PLANS.map((plan) => {
          const isSelected = plan.id === selectedId;
          const t = useTranslations(`settings.subscribe.plans.${plan.id}`);

          return (
            <button
              key={plan.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedId(plan.id)}
              className={cn("flex items-center gap-4 rounded-xl border p-4 text-left transition-colors flex-1 md:flex-col md:text-center", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-muted-foreground/40")}>
              <span
                className={cn("grid size-5 shrink-0 place-items-center rounded-full border transition-colors", isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40")}
                aria-hidden>
                {isSelected && (
                  <IconCheck
                    className="size-3"
                    stroke={3}
                  />
                )}
              </span>

              <span className="min-w-0 flex-1 md:flex md:flex-col md:items-center">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold">{t("title")}</span>
                  {plan.id === "yearly" && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">{t("top")}</span>}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{t("note")}</span>
                {plan.id === "yearly" && <span className="mt-0.5 block text-sm font-medium text-success">{t("trial")}</span>}
              </span>

              <span className="shrink-0 max-md:text-right">
                <span className="block text-lg font-bold tabular-nums">${plan.price}</span>
                <span className="block text-xs text-muted-foreground">{t("period")}</span>
              </span>
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full mt-5"
        onClick={handleSubscribe}
        disabled={pending}>
        {pending && (
          <IconLoader2
            className="size-4 animate-spin"
            aria-hidden
          />
        )}
        {t(`${selected.id}.button`)}
      </Button>

      <p className="mt-3 text-center text-xs text-muted-foreground">{t(`${selected.id}.footnote`)}</p>
    </>
  );
}
