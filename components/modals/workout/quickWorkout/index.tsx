"use client";

import { ModalWrapper } from "../../ModalWrapper";
import { QuickExerciseCard } from "../_components/QuickExerciseCard";
import { QuickWorkoutSession } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useAllExercises } from "@/hooks/useServices/useExercises";
import { useWorkoutSession } from "@/hooks/workout/useWorkoutSession";
import { useModal } from "@/components/modals/ModalProvider";
import { Select } from "@/components/ui/form/Select";
import { Timestamp } from "firebase/firestore";
import { WorkoutHeader } from "../_components/WorkoutHeader";
import { WorkoutFooter } from "../_components/WorkoutFooter";
import { useWorkoutSessionPersistence } from "@/hooks/workout/useWorkoutSessionPersistence";
import { useFinishWorkout, useRestoredDraftNotice } from "@/hooks/workout/useWorkoutSync";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedText, toLocalizedText, type Locale } from "@/types/common";

export function QuickWorkoutModal() {
  const t = useTranslations("workout");
  const locale = useLocale() as Locale;
  const { user } = useAuth();
  const { confirm, close } = useModal();
  const finishWorkout = useFinishWorkout();

  const initialWorkout: QuickWorkoutSession = {
    id: crypto.randomUUID(),
    name: "Quick workout",
    startedAt: Timestamp.fromDate(new Date()),
    duration: 0,
    isQuick: true,
    exercises: [],
  };

  const {
    workout,
    setWorkout,
    isPaused,
    setIsPaused,
    elapsedTime,
    formatTime,
    handleUpdateSet,
    handleAddSet,
    handleRemoveSet,
    totalSets,
    completedSets,
    progress,
    getFinishedWorkout,
    persistWorkoutDraft,
    restoredFromDraft,
    discardDraft,
    markFinished,
  } = useWorkoutSession(initialWorkout, { userId: user?.uid, slot: "quick" });

  useWorkoutSessionPersistence({ persist: persistWorkoutDraft, isPaused });
  useRestoredDraftNotice(restoredFromDraft, discardDraft);

  const { data: exercises = [], isLoading: loading } = useAllExercises(user?.uid);

  const handleAddExercise = (exerciseIdOrName: string, isQuick = false) => {
    if (isQuick) {
      const name =
        exerciseIdOrName.trim().length === 0
          ? `Quick Exercise ${workout.exercises.length + 1}`
          : exerciseIdOrName.trim();
      setWorkout((prev) => ({
        ...prev,
        exercises: [
          ...prev.exercises,
          {
            id: crypto.randomUUID(),
            name: toLocalizedText(name),
            isQuick: true,
            sets: [{ weight: 0, reps: 0, completed: false }],
          },
        ],
      }));
      return;
    }

    const found = exercises.find((ex) => ex.id === exerciseIdOrName);
    if (!found) return;

    setWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id: found.id,
          name: found.name,
          description: found.description,
          muscleGroup: found.muscleGroup,
          imageUrl: found.imageUrl,
          isCustom: found.isCustom,
          sets: Array.from({ length: 3 }, () => ({ completed: false, reps: 0, weight: 0 })),
        },
      ],
    }));
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((exercise) => exercise.id !== exerciseId),
    }));
  };

  const handleFinishWorkout = async () => {
    const finishedWorkout = getFinishedWorkout();

    const ok = await confirm({
      title: t("confirmFinish.title"),
    });

    if (ok) {
      if (!user) throw new Error("Not authenticated");
      // Saves locally first and syncs in the background, so it also works offline.
      finishWorkout(user.uid, finishedWorkout, markFinished);
      close();
    }
  };

  return (
    <ModalWrapper
      modalType="quickWorkout"
      size="high"
      header={false}
      title={workout.name}
      contentClasses="!py-0">
      <WorkoutHeader
        title={workout.name}
        elapsedTime={formatTime(elapsedTime)}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onClose={() => {
          close();
          persistWorkoutDraft("modal-close");
        }}
        progress={progress}
      />

      <main className={cn("flex-1 space-y-4 py-4")}>
        {workout.exercises.map((workoutExercise) => (
          <QuickExerciseCard
            key={workoutExercise.id}
            workoutExercise={workoutExercise}
            onUpdateSet={(index, updates) => handleUpdateSet(workoutExercise.id, index, updates)}
            onAddSet={() => handleAddSet(workoutExercise.id)}
            onRemoveSet={() => handleRemoveSet(workoutExercise.id)}
            onRemoveExercise={() => handleRemoveExercise(workoutExercise.id)}
          />
        ))}
        <Select
          input={{
            options: exercises
              .filter((exercise) => !workout.exercises.some((w) => w.id === exercise.id))
              .map((exercise) => ({ value: exercise.id, label: getLocalizedText(exercise.name, locale) })),
            placeholder: t("modal.search.placeholder"),
            allowCustom: true,
            onChange: handleAddExercise,
            isLoading: loading,
          }}
        />
      </main>

      <WorkoutFooter
        completedSets={completedSets}
        totalSets={totalSets}
        onFinish={handleFinishWorkout}
      />
    </ModalWrapper>
  );
}
