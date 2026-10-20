"use client";

import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import { useUserPreferences } from "@/providers/UserPreferencesProvider";
import { PersonalRecord } from "@/types";
import { useTranslations } from "next-intl";

interface TotalRecordsProps {
  records: PersonalRecord[];
  loading: boolean;
}

export default function TotalRecords({ records, loading }: TotalRecordsProps) {
  const { params } = useUserPreferences();
  const tMeasurement = useTranslations("components.measurement");
  const t = useTranslations("stats.records");

  if (!records.length) return;

  return (
    <div className="mt-5 space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground">{t("title")}</h2>

      <SkeletonSwitcher
        isLoading={loading}
        skeleton={
          <div className="space-y-3">
            <SkeletonBone
              br={12}
              height={84}
            />
          </div>
        }>
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-card p-4">
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{records.length}</p>
            <p className="text-sm text-muted-foreground">{t("amount")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              {Math.max(...records.map((pr) => pr.weight))}
              {tMeasurement(params.weight)}
            </p>
            <p className="text-sm text-muted-foreground">{t("heaviestLift")}</p>
          </div>
        </div>
      </SkeletonSwitcher>
    </div>
  );
}
