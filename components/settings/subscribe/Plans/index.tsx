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
      // TODO(roadmap 4.1): start checkout for `selected.id` (Stripe/LemonSqueezy).
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div
        role="radiogroup"
        aria-label={t("ariaLabel")}
        className="mt-6 flex gap-3 max-md:flex-col">
        {DEFAULT_PLANS.map((plan) => {
          const isSelected = plan.id === selectedId;

          return (
            <button
              key={plan.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedId(plan.id)}
              className={cn(
                "flex flex-1 items-center gap-4 rounded-xl border p-4 text-left transition-colors md:flex-col md:text-center",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-muted-foreground/40",
              )}>
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
                  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
                )}
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
                  <span className="font-semibold">{t(`${plan.id}.title`)}</span>
                  {plan.id === "yearly" && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                      {t(`${plan.id}.top`)}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{t(`${plan.id}.note`)}</span>
                {plan.id === "yearly" && (
                  <span className="mt-0.5 block text-sm font-medium text-success">{t(`${plan.id}.trial`)}</span>
                )}
              </span>

              <span className="shrink-0 max-md:text-right">
                <span className="block text-lg font-bold tabular-nums">${plan.price}</span>
                <span className="block text-xs text-muted-foreground">{t(`${plan.id}.period`)}</span>
              </span>
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        size="lg"
        className="mt-5 w-full"
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
