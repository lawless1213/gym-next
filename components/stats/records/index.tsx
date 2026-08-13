"use client";

import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useRecords } from "@/hooks/useServices/useRecords";
import { IconTrophy } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import RecordCard from "@/components/shared/cards/recordCard";
import TotalRecords from "./TotalRecords";

export default function Records() {
  const t = useTranslations("stats.records");
  const tMeasurement = useTranslations("components.measurement");

  const { user } = useAuth();
  const userId = user?.uid;

  const { data, isLoading: loading } = useRecords({userId});

  const records = data ? Object.values(data) : [];

  return (
    <>
      {/* Personal Records */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">{t("title")}</h2>

        <SkeletonSwitcher
          isLoading={loading}
          skeleton={
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonBone
                  key={i}
                  br={12}
                  height={68}
                />
              ))}
            </div>
          }>
          {records ? (
            <div className="space-y-3">
              {records
                .sort((a, b) => b.date.toMillis() - a.date.toMillis())
                .map((record: any) => (
                  <RecordCard
                    key={`${record.workoutId}-${record.date?.toMillis?.() ?? ''}`}
                    record={record}
                  />
                ))}
            </div>
          ) : (
            <div>{t("empty")}</div>
          )}
        </SkeletonSwitcher>
      </div>

      {/* Total Stats */}
      <TotalRecords records={records} loading={loading}/>
    </>
  );
}
