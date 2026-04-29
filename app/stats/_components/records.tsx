"use client";

import SkeletonBone from "@/app/components/common/skeletonBone";
import SkeletonSwitcher from "@/app/components/common/SkeletonSwitcher";
import { personalRecords } from "@/app/data/mock-data";
import { useAuth } from "@/app/hooks/useAuth";
import { useRecords } from "@/app/hooks/useServices/useRecords";
import { IconTrophy } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import RecordCard from "./recordCard";

export default function Records() {
  const t = useTranslations("stats.records");
  const tMeasurement = useTranslations("components.measurement");

  const { user } = useAuth();
  const userId = user?.uid;

  const { data, isLoading: loading } = useRecords(userId);

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
                  height={140}
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
                    key={record.workoutId}
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
              <p className="text-2xl font-bold text-foreground">{Math.max(...records.map((pr) => pr.weight))}{tMeasurement('kg')}</p>
              <p className="text-sm text-muted-foreground">{t("heaviestLift")}</p>
            </div>
          </div>
        </SkeletonSwitcher>
      </div>
    </>
  );
}
