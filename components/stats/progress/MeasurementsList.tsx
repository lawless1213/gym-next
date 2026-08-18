import { useState } from "react";
import { IconScale, IconTrendingDown, IconTrendingUp, IconActivity, IconTrophy, IconEdit } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLocale, useTranslations } from "next-intl";
import { useLastProgress } from "@/hooks/useServices/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { BodyProgress, Measurement } from "@/types";
import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import ButtonAdd from "@/components/shared/ButtonAdd";
import { useModal } from "@/components/modals/modal-store";
import NewMeasurements from "./NewMeasurements";

interface MeasurementsListProps {
  progress: Measurement[];
  loading: boolean;
  increaseProfit?: boolean;
  unit?: string;
}

export default function MeasurementsList({ progress, loading, increaseProfit, unit }: MeasurementsListProps) {
  const locale = useLocale();
  const reversedProgress = progress.toReversed();

  return (
    <SkeletonSwitcher
      isLoading={loading}
      skeleton={
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBone
              key={i}
              br={12}
              height={64}
            />
          ))}
        </div>
      }>
      {progress ? (
        <div className="space-y-3">
          {reversedProgress.map((measurement: Measurement, index: number) => {
            const previousMeasurement = reversedProgress[index + 1];
            const difference = previousMeasurement ? measurement.value - previousMeasurement.value : null;

            let textColorClass = "text-muted-foreground";

            if (difference !== null && difference !== 0) {
              const isGoodProgress = (difference > 0 && increaseProfit) || (difference < 0 && !increaseProfit);
              textColorClass = isGoodProgress ? "text-emerald-500" : "text-rose-500";
            }

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 text-muted-foreground">{difference !== null && difference !== 0 ? difference > 0 ? <IconTrendingUp className="h-4 w-4" /> : <IconTrendingDown className="h-4 w-4" /> : <IconActivity className="h-4 w-4" />}</div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">{measurement.date.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })}</div>

                  {difference !== null && (
                    <div className={`text-xs font-medium ${textColorClass}`}>
                      {difference > 0 ? `+${difference.toFixed(1)}` : difference.toFixed(1)} {unit}
                    </div>
                  )}
                </div>

                <span className="text-xl font-bold text-foreground shrink-0">{measurement.value + (unit || "")}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div>empty</div>
      )}
    </SkeletonSwitcher>
  );
}
