"use client";

import { ExerciseListItem } from "@/components/library/exercises/exerciseListItem";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Exercise } from "@/types";

interface ExercisesListProps {
  visibleExercises: Exercise[];
  hasMore: boolean;
  handleLoadMore: () => void;
}

export default function ExercisesList({
  visibleExercises,
  hasMore,
  handleLoadMore,
}: ExercisesListProps) {
  const t = useTranslations("library.exercises");

  return (
    <div className="space-y-6 mt-6 max-md:-mx-4">
      {visibleExercises.length > 0 ? (
        visibleExercises.map((exercise) => (
          <ExerciseListItem
            key={exercise.id}
            exercise={exercise}
          />
        ))
      ) : (
        <p className="text-center text-sm text-muted-foreground py-8">
          {t("notFound")}
        </p>
      )}

      {hasMore && (
        <Button
          variant="outline"
          onClick={handleLoadMore}
          className="w-full"
        >
          {t("loadMore")}
        </Button>
      )}
    </div>
  );
}