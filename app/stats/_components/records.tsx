"use client";

import { personalRecords } from "@/app/data/mock-data";
import { IconTrophy } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function Records() {
  const t = useTranslations("stats");

  return (
    <>
      {/* Personal Records */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Personal Records</h2>
        {personalRecords.map((pr) => (
          <div
            key={pr.id}
            className="flex items-center gap-4 rounded-xl bg-card p-4">
            {/* Trophy */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20">
              <IconTrophy className="h-6 w-6 text-primary" />
            </div>

            {/* PR Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{pr.exerciseName}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(pr.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Weight & Reps */}
            <div className="text-right">
              <p className="text-xl font-bold text-primary">{pr.weight}kg</p>
              <p className="text-sm text-muted-foreground">x{pr.reps}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Total Stats */}
      <div className="rounded-xl bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">All-Time Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-foreground">{personalRecords.length}</p>
            <p className="text-sm text-muted-foreground">Personal Records</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{Math.max(...personalRecords.map((pr) => pr.weight))}kg</p>
            <p className="text-sm text-muted-foreground">Heaviest Lift</p>
          </div>
        </div>
      </div>
    </>
  );
}
