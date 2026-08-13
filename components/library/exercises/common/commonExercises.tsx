"use client";

import { useState, useMemo } from "react";
import { IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useCommonExercises } from "@/hooks/useServices/useExercises";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import { ExercisesSkeleton } from "../exercisesSkeleton";
import ExercisesList from "../exercisesList";

const ITEMS_PER_PAGE = 10;

export default function CommonExercises() {
  const t = useTranslations("Library.exercises");

  const [searchQuery, setSearchQuery] = useState("");
  const [displayLimit, setDisplayLimit] = useState(ITEMS_PER_PAGE);

  const { data: exercises = [], isLoading: loading } = useCommonExercises();

  const filteredExercises = useMemo(() => {
    if (!searchQuery) return exercises;
    const query = searchQuery.toLowerCase().trim();

    return exercises.filter((ex) => ex.name?.toLowerCase().includes(query) || ex.muscleGroup?.toLowerCase().includes(query));
  }, [searchQuery, exercises]);

  const visibleExercises = useMemo(() => {
    return filteredExercises.slice(0, displayLimit);
  }, [filteredExercises, displayLimit]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setDisplayLimit(ITEMS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + ITEMS_PER_PAGE);
  };

  const hasMore = visibleExercises.length < filteredExercises.length;

  return (
    <>
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full rounded-xl bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <SkeletonSwitcher
        isLoading={loading}
        skeleton={ExercisesSkeleton}>
        <ExercisesList
          visibleExercises={visibleExercises}
          hasMore={hasMore}
          handleLoadMore={handleLoadMore}
        />
      </SkeletonSwitcher>
    </>
  );
}
