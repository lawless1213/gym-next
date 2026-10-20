"use client";

import { ModalWrapper } from "../ModalWrapper";
import { ExerciseCard } from "./_components/ExerciseCard";
import { RegularWorkoutSession } from "@/types";
import { useRecords } from "@/hooks/useServices/useRecords";
import { useAuth } from "@/hooks/useAuth";
import { useWorkoutModal } from "@/hooks/useModals/useWorkoutModal";
import { useWorkoutSession } from "@/hooks/workout/useWorkoutSession";
import { Timestamp } from "firebase/firestore";
import { WorkoutHeader } from "./_components/WorkoutHeader";
import { WorkoutFooter } from "./_components/WorkoutFooter";
import { useWorkoutSessionPersistence } from "@/hooks/workout/useWorkoutSessionPersistence";
import { useFinishWorkout, useRestoredDraftNotice } from "@/hooks/workout/useWorkoutSync";
import { useTranslations } from "next-intl";

export function WorkoutModal() {
  const t = useTranslations("workout");
  const { user } = useAuth();
  const { confirm, close, routine } = useWorkoutModal();
  const finishWorkout = useFinishWorkout();

  const initialWorkout: RegularWorkoutSession = {
    id: crypto.randomUUID(),
    isQuick: false,
    routineId: routine.id,
    name: routine.name,
    startedAt: Timestamp.fromDate(new Date()),
    duration: 0,
    exercises: routine.exercises.map((exercise) => ({
      ...exercise,
      sets: Array.from({ length: 3 }, () => ({ completed: false, reps: 0, weight: 0 })),
    })),
  };

  const {
    workout,
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
  } = useWorkoutSession(initialWorkout, { userId: user?.uid, slot: routine.id });

  useWorkoutSessionPersistence({ persist: persistWorkoutDraft, isPaused });
  useRestoredDraftNotice(restoredFromDraft, discardDraft);

  const exerciseIds = routine.exercises.map((ex) => ex.id);
  const { data: records = {} } = useRecords({ userId: user?.uid, exerciseIds });

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
      modalType="workout"
      header={false}
      title={workout.name}
      contentClasses="pt-0">
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

      <main className="flex-1 space-y-4 pt-4 pb-20">
        {workout.exercises.map((workoutExercise) => (
          <ExerciseCard
            key={workoutExercise.id}
            workoutExercise={workoutExercise}
            record={records[workoutExercise.id]}
            onUpdateSet={(index, updates) => handleUpdateSet(workoutExercise.id, index, updates)}
            onAddSet={() => handleAddSet(workoutExercise.id)}
            onRemoveSet={() => handleRemoveSet(workoutExercise.id)}
          />
        ))}
      </main>

      <WorkoutFooter
        completedSets={completedSets}
        totalSets={totalSets}
        onFinish={handleFinishWorkout}
      />
    </ModalWrapper>
  );
}
