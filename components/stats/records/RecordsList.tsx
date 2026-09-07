"use client";

import { useModal } from "@/components/modals/modal-store";
import ActionCard from "@/components/shared/cards/ActionCard";
import RecordCard from "@/components/shared/cards/recordCard";
import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import { PersonalRecord } from "@/types";
import { IconBolt } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface RecordsListProps {
  records: PersonalRecord[];
  loading: boolean;
}

function toMillis(d: any): number {
  if (d == null) return 0;
  if (typeof d === "number") return d;
  if (typeof d === "string") return new Date(d).getTime();
  if (d instanceof Date) return d.getTime();
  if (typeof d.toMillis === "function") return d.toMillis();
  if (typeof d.seconds === "number") {
    return d.seconds * 1000 + Math.floor((d.nanoseconds ?? 0) / 1e6);
  }
  return 0;
}

export default function RecordsList({ records, loading }: RecordsListProps) {
  const t = useTranslations("stats.records");
  const { open, confirm } = useModal();

  return (
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
        {records && records.length ? (
          <div className="space-y-3">
            {records
              .slice()
              .sort((a: any, b: any) => toMillis(b.date) - toMillis(a.date))
              .map((record: any) => (
                <RecordCard
                  key={`${record.workoutId}-${toMillis(record.date)}`}
                  record={record}
                />
              ))}
          </div>
        ) : (
          <ActionCard
            title={t("empty")}
            icon={IconBolt}
            onClick={() => open("quickWorkout")}
          />
        )}
      </SkeletonSwitcher>
    </div>
  );
}
