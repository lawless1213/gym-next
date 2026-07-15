"use client";

import { ModalWrapper } from "../../modal-wrapper";
import { QuickExerciseCard } from "./../_components/quickExerciseCard";
import { QuickWorkoutSession } from "@/app/types";
import { useAuth } from "@/app/hooks/useAuth";
import { useAllExercises } from "@/app/hooks/useServices/useExercises";
import { useWorkoutSession } from "@/app/hooks/useWorkoutSession";
import { useModal } from "@/app/lib/modal/modal-store";
import { Select } from "@/app/__components/form/select";
import { writeWorkoutSession } from "@/app/lib/actions/workout";
import { Timestamp } from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { WorkoutHeader } from "../_components/workoutHeader";
import { WorkoutFooter } from "../_components/workoutFooter";

export function QuickWorkoutModal() {
  const { user } = useAuth();
  const { confirm, close } = useModal();
  const queryClient = useQueryClient();

  const initialWorkout: QuickWorkoutSession = {
    name: "Quick workout",
    startedAt: Timestamp.fromDate(new Date()),
    duration: 0,
    exercises: [
      {
        id: crypto.randomUUID(),
        name: "Quick Exercise 1",
        isQuick: true,
        sets: [{ weight: 0, reps: 0, completed: false }],
      },
    ],
  };

	const {
		workout, setWorkout, isPaused, setIsPaused, elapsedTime, formatTime,
		handleUpdateSet, handleAddSet, handleRemoveSet,
		totalSets, completedSets, progress, getFinishedWorkout,
	} = useWorkoutSession(initialWorkout);

  const { data: exercises = [], isLoading: loading } = useAllExercises(user?.uid);

  const handleAddExercise = (exerciseIdOrName: string, isQuick = false) => {
    if (isQuick) {
      const name = exerciseIdOrName.trim().length === 0 ? `Quick Exercise ${workout.exercises.length + 1}` : exerciseIdOrName.trim();
      setWorkout((prev) => ({
        ...prev,
        exercises: [...prev.exercises, { id: crypto.randomUUID(), name, isQuick: true, sets: [{ weight: 0, reps: 0, completed: false }] }],
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
    <ModalWrapper modalType="quickWorkout" header={false} title={workout.name} contentClasses="pt-0">
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
              .map((exercise) => ({ value: exercise.id, label: exercise.name })),
            placeholder: "Виберіть чи введіть назву",
            menuPosition: "top",
            allowCustom: true,
            onChange: handleAddExercise,
            isLoading: loading,
          }}
        />
      </main>

      <WorkoutFooter completedSets={completedSets} totalSets={totalSets} onFinish={handleFinishWorkout} />
    </ModalWrapper>
  );
}