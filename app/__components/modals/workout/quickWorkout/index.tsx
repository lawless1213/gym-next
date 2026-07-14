"use client";

import { ModalWrapper } from "../../modal-wrapper";
import { IconArrowLeft, IconBarbell, IconCheck, IconClock, IconPlayerPauseFilled, IconPlayerPlay, IconUpload, IconX, IconChecks, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useWorkoutModal } from "@/app/hooks/useModals/useWorkoutModal";
import { QuickExerciseCard } from "./../_components/quickExerciseCard";
import { QuickWorkoutSession, WorkoutSet } from "@/app/types";
import { Button } from "@/app/__components/common/button";
import { useRecords } from "@/app/hooks/useServices/useRecords";
import { useAuth } from "@/app/hooks/useAuth";
import { writeWorkoutSession } from "@/app/lib/actions/workout";
import { Timestamp } from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/app/lib/modal/modal-store";
import { Select } from "@/app/__components/form/select";
import { useAllExercises } from "@/app/hooks/useServices/useExercises";

export function QuickWorkoutModal() {
  const { user } = useAuth();
  const userId = user?.uid;
  const { confirm, close } = useModal();
  const queryClient = useQueryClient();

  const workoutRoutine: QuickWorkoutSession = {
    name: "Quick workout",
    startedAt: Timestamp.fromDate(new Date()),
    duration: 0,
    exercises: [
      {
        id: crypto.randomUUID(),
        name: `Quick Exercise 1`,
        sets: [
          {
            weight: 0,
            reps: 0,
            completed: false,
          },
        ],
      },
    ],
  };

  const { data: exercises = [], isLoading: loading } = useAllExercises(userId);

  const [workout, setWorkout] = useState<QuickWorkoutSession>(workoutRoutine);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleUpdateSet = (exerciseId: string, num: number, updates: Partial<WorkoutSet>) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set, idx) => (idx === num ? { ...set, ...updates } : set)),
            }
          : ex,
      ),
    }));
  };

  const handleAddSet = (exerciseId: string) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  weight: 0,
                  reps: 0,
                  completed: false,
                },
              ],
            }
          : ex,
      ),
    }));
  };

  const handleRemoveSet = (exerciseId: string) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.slice(0, -1),
            }
          : ex,
      ),
    }));
  };

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
						name,
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
          sets: Array.from({ length: 3 }, () => ({
            completed: false,
            reps: 0,
            weight: 0,
          })),
        },
      ],
    }));
  };

  const handleFinishWorkout = async () => {
    const finishedWorkout: QuickWorkoutSession = {
      ...workout,
      duration: elapsedTime,
      volume: workout.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).reduce((setAcc, set) => setAcc + set.weight * set.reps, 0), 0),
    };

    setWorkout(finishedWorkout);

    const ok = await confirm({
      title: "",
      description: "Завершити тренування?",
      cancelLabel: " Ні",
      confirmLabel: "Так",
    });

    if (ok) {
      if (!user) throw new Error("Not authenticated");
      console.log(finishedWorkout);

      // writeWorkoutSession(user?.uid, finishedWorkout);
      // queryClient.invalidateQueries({ queryKey: ["history"] });
      // queryClient.invalidateQueries({ queryKey: ["records"] });
      // queryClient.invalidateQueries({ queryKey: ["schedule"] });
      close();
    }
  };

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <ModalWrapper
      modalType="quickWorkout"
      size="high"
      header={false}
      title={workout.name}
      contentClasses="pt-0">
      <header className="sticky top-0 z-40 border-b border-border bg-card backdrop-blur">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground cursor-pointer"
            aria-label={isPaused ? "Resume" : "Pause"}>
            {isPaused ? <IconPlayerPlay className="h-5 w-5" /> : <IconPlayerPauseFilled className="h-5 w-5" />}
          </button>

          <div className="text-center">
            <h1 className="font-bold text-foreground">{workout.name}</h1>
            <div className="flex items-center justify-center gap-1 text-sm text-primary">
              <IconClock className="h-3.5 w-3.5" />
              <span className="font-mono font-semibold">{formatTime(elapsedTime)}</span>
            </div>
          </div>

          <button
            onClick={close}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground cursor-pointer hover:text-foreground"
            aria-label="Close">
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="h-1 w-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="flex-1 space-y-4 pt-4 pb-20">
        {workout.exercises.map((workoutExercise, index) => (
          <QuickExerciseCard
            key={workoutExercise.id}
            workoutExercise={workoutExercise}
            onUpdateSet={(index, updates) => handleUpdateSet(workoutExercise.id, index, updates)}
            onAddSet={() => handleAddSet(workoutExercise.id)}
            onRemoveSet={() => handleRemoveSet(workoutExercise.id)}
          />
        ))}
        <Select
          input={{
            options: exercises.map((exercise) => ({
              value: exercise.id,
              label: exercise.name,
            })),
						placeholder: "Виберіть вправу чи введіть назву",
            menuPosition: "top",
            allowCustom: true,
            onChange: handleAddExercise,
            isLoading: loading,
          }}
        />
      </main>
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur">
        <Button
          onClick={handleFinishWorkout}
          className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
          disabled={completedSets === 0}>
          <IconChecks className="h-5 w-5" />
          Finish Workout ({completedSets}/{totalSets} sets)
        </Button>
      </div>
    </ModalWrapper>
  );
}
