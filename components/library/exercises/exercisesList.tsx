"use client";

import { ExerciseListItem } from "@/components/library/exercises/exerciseListItem";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Exercise } from "@/types";
import { useState } from "react";

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
  const [openExerciseId, setOpenExerciseId] = useState<string | null>(null);

  const toggleExercise = (id: string) => {
    setOpenExerciseId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-1 max-md:-mx-4">
      {visibleExercises.length > 0 ? (
        visibleExercises.map((exercise) => (
          <ExerciseListItem
            key={exercise.id}
            exercise={exercise}
            isOpen={openExerciseId === exercise.id}
            onToggle={() => toggleExercise(exercise.id)}
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