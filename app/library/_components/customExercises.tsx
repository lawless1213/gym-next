
"use client";

import { useState, useMemo } from "react";
import { ExerciseListItem } from "@/app/__components/exerciseList";
import { IconSearch } from "@tabler/icons-react";
import { useAuth } from "@/app/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useUserExercises } from "@/app/hooks/useServices/useExercises";
import SkeletonBone from "@/app/__components/common/skeletonBone";
import SkeletonSwitcher from "@/app/__components/common/SkeletonSwitcher";
import { Button } from "@/app/__components/common/buttons/button";

const ITEMS_PER_PAGE = 5;

const ExercisesSkeleton = (
  <div className="space-y-6 mt-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="space-y-2">
        <SkeletonBone
          br={12}
          height={20}
        />
        <SkeletonBone
          br={12}
          height={72}
        />
      </div>
    ))}
  </div>
);

export default function CustomExercises() {
  const t = useTranslations("Library.exercises");
  const { user } = useAuth();
  const userId = user?.uid;

  const [searchQuery, setSearchQuery] = useState("");
  const [displayLimit, setDisplayLimit] = useState(ITEMS_PER_PAGE);

  const { data: exercises = [], isLoading: loading } = useUserExercises(userId);

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
        <div className="space-y-6 mt-6 max-md:-mx-4">
          {visibleExercises.length > 0 ? (
            visibleExercises.map((exercise) => (
              <ExerciseListItem
                key={exercise.id}
                exercise={exercise}
              />
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">{t("notFound") || "Нічого не знайдено"}</p>
          )}

          {hasMore && (
            <Button
              variant="outline"
              onClick={handleLoadMore}
              className="w-full">
              {t("loadMore")}
            </Button>
          )}
        </div>
      </SkeletonSwitcher>
    </>
  );
}
