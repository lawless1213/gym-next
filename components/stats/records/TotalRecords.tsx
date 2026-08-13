"use client";

import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import { PersonalRecord } from "@/types";
import { useTranslations } from "next-intl";

interface TotalRecordsProps {
  records: PersonalRecord[];
  loading: boolean;
}

export default function TotalRecords({records, loading}: TotalRecordsProps) {
  const tMeasurement = useTranslations("components.measurement");
  const t = useTranslations("stats.records");
  
  return (
    <div className="space-y-3 mt-5">
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
        <div className="rounded-xl bg-card p-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-foreground">{records.length}</p>
            <p className="text-sm text-muted-foreground">{t("amount")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {Math.max(...records.map((pr) => pr.weight))}
              {tMeasurement("kg")}
            </p>
            <p className="text-sm text-muted-foreground">{t("heaviestLift")}</p>
          </div>
        </div>
      </SkeletonSwitcher>
    </div>
  );
}
