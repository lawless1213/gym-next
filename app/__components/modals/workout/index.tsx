"use client";

import { ModalWrapper } from "../modal-wrapper";
import { ExerciseCard } from "./_components/exerciseCard";
import { WorkoutSession } from "@/app/types";
import { useRecords } from "@/app/hooks/useServices/useRecords";
import { useAuth } from "@/app/hooks/useAuth";
import { useWorkoutModal } from "@/app/hooks/useModals/useWorkoutModal";
import { useWorkoutSession } from "@/app/hooks/useWorkoutSession";
import { writeWorkoutSession } from "@/app/lib/actions/workout";
import { Timestamp } from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { WorkoutHeader } from "./_components/workoutHeader";
import { WorkoutFooter } from "./_components/workoutFooter";

export function WorkoutModal() {
  const { user } = useAuth();
  const { confirm, close, routine } = useWorkoutModal();
  const queryClient = useQueryClient();

  const initialWorkout: WorkoutSession = {
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
    workout, isPaused, setIsPaused, elapsedTime, formatTime,
    handleUpdateSet, handleAddSet, handleRemoveSet,
    totalSets, completedSets, progress, getFinishedWorkout,
  } = useWorkoutSession(initialWorkout);

  const exerciseIds = routine.exercises.map((ex) => ex.id);
  const { data: records = {} } = useRecords({ userId: user?.uid, exerciseIds });

  const handleFinishWorkout = async () => {
    const finishedWorkout = getFinishedWorkout();

    const ok = await confirm({
      title: "",
      description: "Завершити тренування?",
      cancelLabel: " Ні",
      confirmLabel: "Так",
    });

    if (ok) {
      if (!user) throw new Error("Not authenticated");
      writeWorkoutSession(user.uid, finishedWorkout);
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["records"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      close();
    }
  };

  return (
    <ModalWrapper modalType="workout" header={false} title={workout.name} contentClasses="pt-0">
      <WorkoutHeader
        title={workout.name}
        elapsedTime={formatTime(elapsedTime)}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onClose={close}
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

      <WorkoutFooter completedSets={completedSets} totalSets={totalSets} onFinish={handleFinishWorkout} />
    </ModalWrapper>
  );
}