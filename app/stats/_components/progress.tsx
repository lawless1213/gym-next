import { useState } from "react";
import { bodyMeasurements } from "@/app/data/mock-data";
import { IconScale, IconTrendingDown, IconTrendingUp, IconActivity } from "@tabler/icons-react";
import { cn } from "@/app/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslations } from "next-intl";
import { useLastProgress } from "@/app/hooks/useServices/useStats";
import { useAuth } from "@/app/hooks/useAuth";
import { BodyProgress } from "@/app/types";

export default function Progress() {
  const t = useTranslations("stats");
  const { user } = useAuth();
  const userId = user?.uid;

  const { data: progress, isLoading: loading } = useLastProgress(userId);

  const [selectedMetric, setSelectedMetric] = useState<keyof BodyProgress>("weight");

  const chartData =
    progress &&
    progress[selectedMetric].map((m) => ({
      date: m.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: m.value,
    }));

  const weightChange = progress?.weight && progress.weight.length >= 2 ? progress.weight.at(-1)!.value - progress.weight[0]!.value : 0;
  const waistChange = progress?.weight && progress.waist.length >= 2 ? progress.waist.at(-1)!.value - progress.waist[0]!.value : 0;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setSelectedMetric("weight")}
          className={cn("rounded-xl p-4 text-left transition-all", selectedMetric === "weight" ? "bg-primary/10 ring-2 ring-primary" : "bg-card")}>
          <div className="flex items-center gap-2">
            <IconScale className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Weight</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{progress?.weight.at(-1)!.value} kg</p>
          {weightChange !== 0 && (
            <div className={cn("mt-1 flex items-center gap-1 text-sm", weightChange < 0 ? "text-primary" : "text-destructive")}>
              {weightChange < 0 ? <IconTrendingDown className="h-3.5 w-3.5" /> : <IconTrendingUp className="h-3.5 w-3.5" />}
              <span>{Math.abs(weightChange).toFixed(1)} kg</span>
            </div>
          )}
        </button>

        <button
          onClick={() => setSelectedMetric("waist")}
          className={cn("rounded-xl p-4 text-left transition-all", selectedMetric === "waist" ? "bg-primary/10 ring-2 ring-primary" : "bg-card")}>
          <div className="flex items-center gap-2">
            <IconActivity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Waist</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{progress?.waist.at(-1)!.value} cm</p>
          {waistChange !== 0 && (
            <div className={cn("mt-1 flex items-center gap-1 text-sm", waistChange < 0 ? "text-primary" : "text-destructive")}>
              {waistChange < 0 ? <IconTrendingDown className="h-3.5 w-3.5" /> : <IconTrendingUp className="h-3.5 w-3.5" />}
              <span>{Math.abs(waistChange).toFixed(1)} cm</span>
            </div>
          )}
        </button>
      </div>

      {chartData && (
        <div className="rounded-xl bg-card p-4">
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground">{selectedMetric === "weight" ? "Weight" : "Waist"} Progress</h3>
          <div className="h-48">
            <ResponsiveContainer
              width="100%"
              height="100%">
								
              <LineChart data={chartData} accessibilityLayer={false}>
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
                          {value} {selectedMetric === "weight" ? "kg" : "cm"}
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
          </div>
        </div>
      )}

      <div className="rounded-xl bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Other Measurements</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{progress?.chest.at(-1)!.value}</p>
            <p className="text-xs text-muted-foreground">Chest (cm)</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{progress?.arms.at(-1)!.value}</p>
            <p className="text-xs text-muted-foreground">Arms (cm)</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{progress?.thighs.at(-1)!.value}</p>
            <p className="text-xs text-muted-foreground">Thighs (cm)</p>
          </div>
        </div>
      </div>
    </>
  );
}
