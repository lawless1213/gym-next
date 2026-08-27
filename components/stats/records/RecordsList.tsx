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
              .sort((a, b) => b.date.toMillis() - a.date.toMillis())
              .map((record: any) => (
                <RecordCard
                  key={`${record.workoutId}-${record.date?.toMillis?.() ?? ""}`}
                  record={record}
                />
              ))}
          </div>
        ) : (
          <ActionCard title={t("empty")} icon={IconBolt} onClick={() => open("quickWorkout")}/>
        )}
      </SkeletonSwitcher>
    </div>
  );
}
