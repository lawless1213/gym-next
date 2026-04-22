"use client";

import { useState, useMemo, useEffect } from "react";
import { Exercise } from "@/app/types";
import { ExerciseCategory } from "@/app/ui/exerciseList";
import { IconSearch, IconPlus, IconBarbell, IconFolderOpen } from "@tabler/icons-react";
import { getUserExercises } from "../../lib/services/exercises";
import { useUser } from "@/app/hooks/useUser";
import Loader from "../../ui/common/loader";
import { useTranslations } from "next-intl";
import { useExercises } from "@/app/hooks/useServices/useExercises";

export default function Exercises() {
  const t = useTranslations("Library.exercises");
  const { user } = useUser();
  const userID = user?.uid;
  const [searchQuery, setSearchQuery] = useState("");

  const { data: exercises = [], isLoading: loading } = useExercises(userID);

  const filteredExercises = useMemo(() => {
    if (!searchQuery) return exercises;
    const query = searchQuery.toLowerCase();
    return exercises.filter((ex) => ex.name.toLowerCase().includes(query) || ex.muscleGroup.toLowerCase().includes(query));
  }, [searchQuery, exercises]);

  const groupedExercises = useMemo(() => {
    const groups: Record<string, Exercise[]> = {};
    filteredExercises.forEach((ex) => {
      if (!groups[ex.muscleGroup]) {
        groups[ex.muscleGroup] = [];
      }
      groups[ex.muscleGroup].push(ex);
    });
    return groups;
  }, [filteredExercises]);

  return loading ? (
    <div className="flex items-center justify-center min-h-[300px]">
			<Loader />
		</div>
  ) : (
    <>
      {/* Search */}
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Exercise List */}
      <div className="space-y-6">
        {Object.entries(groupedExercises).map(([group, exs]) => (
          <ExerciseCategory
            key={group}
            title={group}
            exercises={exs}
            onExerciseClick={() => {}}
          />
        ))}
      </div>

      {/* Create Exercise FAB */}
      <button
        // onClick={onCreateExercise}
        className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Create exercise">
        <IconPlus className="h-6 w-6" />
      </button>
    </>
  );
}
