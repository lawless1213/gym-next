"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRecords } from "@/hooks/useServices/useRecords";
import { useTranslations } from "next-intl";
import TotalRecords from "./TotalRecords";
import RecordsList from "./RecordsList";

export default function Records() {
  const t = useTranslations("stats.records");

  const { user } = useAuth();
  const userId = user?.uid;

  const { data, isLoading: loading } = useRecords({userId});

  const records = data ? Object.values(data) : [];

  return (
    <>
      <RecordsList records={records} loading={loading}/>
      <TotalRecords records={records} loading={loading}/>
    </>
  );
}
