import { useState } from "react";
import { IconScale, IconActivity} from "@tabler/icons-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useLocale, useTranslations } from "next-intl";
import { useLastProgress } from "@/hooks/useServices/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { BodyProgress } from "@/types";
import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import { useModal } from "@/components/modals/modal-store";
import NewMeasurements from "./NewMeasurements";
import MeasurementsList from "./MeasurementsList";
import MeasurementsGrid from "./MeasurementsGrid";
import MeasurementsChart from "./MeasurementsChart";

export default function Progress() {
  const locale = useLocale();
  const t = useTranslations("stats");
  const tMeasurement = useTranslations("components.measurement");
  const { user } = useAuth();
  const userId = user?.uid;

  const { data: progress, isLoading: loading } = useLastProgress(userId);

  const [selectedMetric, setSelectedMetric] = useState<keyof BodyProgress>("weight");

  const chartData =
    progress &&
    progress[selectedMetric].map((m) => ({
      date: m.date.toLocaleDateString(locale, { month: "short", day: "numeric" }),
      value: m.value,
    }));

  const weightChange = progress?.weight && progress.weight.length >= 2 ? progress.weight.at(-1)!.value - progress.weight.at(-2)!.value : 0;
  const waistChange = progress?.waist && progress.waist.length >= 2 ? progress.waist.at(-1)!.value - progress.waist.at(-2)!.value : 0;
  const chestChange = progress?.chest && progress.chest.length >= 2 ? progress.chest.at(-1)!.value - progress.chest.at(-2)!.value : 0;
  const thighsChange = progress?.thighs && progress.thighs.length >= 2 ? progress.thighs.at(-1)!.value - progress.thighs.at(-2)!.value : 0;
  const armsChange = progress?.arms && progress.arms.length >= 2 ? progress.arms.at(-1)!.value - progress.arms.at(-2)!.value : 0;

  const metrics = [
    { key: "weight" as keyof BodyProgress, label: t("measurements.weight"), unit: tMeasurement("kg"), icon: IconScale, change: weightChange, increaseProfit: false },
    { key: "waist" as keyof BodyProgress, label: t("measurements.waist"), unit: tMeasurement("cm"), icon: IconActivity, change: waistChange, increaseProfit: false },
    { key: "chest" as keyof BodyProgress, label: t("measurements.chest"), unit: tMeasurement("cm"), icon: IconActivity, change: chestChange, increaseProfit: true },
    { key: "arms" as keyof BodyProgress, label: t("measurements.arms"), unit: tMeasurement("cm"), icon: IconActivity, change: armsChange, increaseProfit: true },
    { key: "thighs" as keyof BodyProgress, label: t("measurements.thighs"), unit: tMeasurement("cm"), icon: IconActivity, change: thighsChange, increaseProfit: true },
  ];

  return (
    <div className="space-y-2 min-w-0">
      <MeasurementsGrid
        metrics={metrics}
        progress={progress}
        loading={loading}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
      />

      <MeasurementsChart loading={loading} progress={progress} selectedMetric={selectedMetric} />
      <MeasurementsList
        loading={loading}
        progress={progress?.[selectedMetric] ?? []}
        unit={metrics.find((item) => item.key === selectedMetric)?.unit}
        increaseProfit={metrics.find((item) => item.key === selectedMetric)?.increaseProfit}
      />
      <NewMeasurements />
    </div>
  );
}
