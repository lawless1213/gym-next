import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BodyProgress, Measurement } from "@/types";
import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";

type MetricItem = {
  key: keyof BodyProgress;
  label: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  change: number;
};

interface MetricsGridProps {
  metrics: MetricItem[];
  progress?: BodyProgress;
  loading: boolean;
  selectedMetric: string;
  setSelectedMetric: (key: keyof BodyProgress) => void;
}

export default function MeasurementsGrid({ metrics, progress, loading, selectedMetric, setSelectedMetric }: MetricsGridProps) {
  return (
    <SkeletonSwitcher
      isLoading={loading}
      skeleton={
        <div className="grid grid-cols-6 gap-3">
          {metrics.map((_, i) => (
            <SkeletonBone
              key={i}
              br={12}
              height={i < 2 ? 104 : 96}
              className={i < 2 ? "col-span-3" : "col-span-2"}
            />
          ))}
        </div>
      }>
      <div className="grid grid-cols-6 gap-3">
        {metrics.map(({ key, label, unit, icon: Icon, change }, i) => {
          const isLarge = i < 2;
          const isNegative = isLarge ? change < 0 : change > 0;

          const changeBlock = change !== 0 && (
            <span
              className={cn(
                "flex items-center justify-center gap-1 text-sm",
                isNegative ? "text-primary" : "text-destructive"
              )}>
              {change < 0 ? (
                <IconTrendingDown className="h-3.5 w-3.5" />
              ) : (
                <IconTrendingUp className="h-3.5 w-3.5" />
              )}
              <span>
                {Math.abs(change)} {unit}
              </span>
            </span>
          );

          return (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={cn(
                "rounded-xl p-4 text-center transition-all cursor-pointer",
                isLarge ? "col-span-3" : "col-span-2",
                selectedMetric === key ? "bg-primary/10 ring-2 ring-primary" : "bg-card"
              )}>
              <div className="flex items-center justify-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>

              {isLarge ? (
                <div className="text-2xl font-bold text-foreground">
                  {progress?.[key].at(-1)!.value} {unit}
                  {changeBlock}
                </div>
              ) : (
                <div className="text-md font-bold text-foreground">
                  {progress?.[key].at(-1)!.value} {unit}
                  {changeBlock}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </SkeletonSwitcher>
  );

}
