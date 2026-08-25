"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { Header } from "@/components/shared/Header";
import { useHistory } from "../../hooks/useServices/useHistory";
import WeekStats from "@/components/history/WeekStats";
import WorkoutList from "@/components/history/WorkoutList";

export default function History() {
  const t = useTranslations("history");
  const { user, loading: isUserLoading } = useAuth();
  const userId = user?.uid;

  const { data: history = [], isLoading: isDataLoading } = useHistory(userId, { period: "week" });
  const loading = isUserLoading || isDataLoading || (!!userId && !history);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <WeekStats history={history} loading={loading}/>
      <WorkoutList history={history} loading={loading}/>
    </div>
  );
}
