import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { BodyProgress } from "@/types";
import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";

interface MeasurementsChartProps {
  progress?: BodyProgress;
  loading: boolean;
  selectedMetric: keyof BodyProgress;
}

export default function MeasurementsChart({ progress, selectedMetric, loading }: MeasurementsChartProps) {
  const locale = useLocale();
  const t = useTranslations("stats");
  const tMeasurement = useTranslations("components.measurement");
  const { user } = useAuth();

  const chartData =
    progress &&
    progress[selectedMetric]?.map((m) => ({
      date: m.date.toLocaleDateString(locale, { month: "short", day: "numeric" }),
      value: m.value,
    }));

  return (
    <SkeletonSwitcher
      isLoading={loading}
      contentKey={selectedMetric}
      skeleton={
        <SkeletonBone
          br={12}
          height={260}
        />
      }>
      <div className="w-full rounded-xl bg-card py-4 pr-4">
        <h3 className="pl-4 mb-4 text-sm font-semibold text-muted-foreground">{t(`measurements.${selectedMetric}`)}</h3>
        <div className="h-48 w-full min-w-0 flex items-center text-center justify-center">
          {!chartData?.length || !chartData ? (
            <div className="text-muted-foreground pl-4">{t("progress.chart.empty")}</div>
          ) : (
            <ResponsiveContainer className="h-full w-full min-w-0">
              <LineChart
                key={selectedMetric}
                data={chartData}
                accessibilityLayer={false}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={["dataMin - 2", "dataMax + 2"]}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip
                  cursor={false}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const { value, date } = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-xl p-2">
                        <div className="font-semibold">
                          {value} {selectedMetric === "weight" ? tMeasurement("kg") : tMeasurement("cm")}
                        </div>
                        <div className="text-xs text-muted-foreground">{date}</div>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--primary)", strokeWidth: 0, r: 4 }}
                  activeDot={{
                    r: 10,
                    strokeWidth: 0,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </SkeletonSwitcher>
  );
}
