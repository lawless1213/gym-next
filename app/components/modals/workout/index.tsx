"use client";

import { ModalWrapper } from "../modal-wrapper";
import { IconArrowLeft, IconBarbell, IconCheck, IconClock, IconPlayerPauseFilled, IconPlayerPlay, IconUpload, IconX, IconChecks } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useWorkoutModal } from "@/app/hooks/ useModals/useWorkoutModal";
import { ExerciseCard } from "./_components/exerciseCard";
import { WorkoutSession, WorkoutSet } from "@/app/types";
import { Button } from "../../common/button";

export function WorkoutModal() {
  const { close, routine } = useWorkoutModal();

  const workoutRoutine: WorkoutSession = {
    routineId: routine.id,
    name: routine.name,
    startedAt: new Date().toISOString(),
    duration: 0,
    exercises: routine.exercises.map((exercise) => ({
      ...exercise,
      sets: Array.from({ length: 3 }, () => ({
        completed: false,
        reps: 0,
        weight: 0,
      })),
    })),
  };

  const [workout, setWorkout] = useState<WorkoutSession>(workoutRoutine);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

    console.log(workout);
    
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

  const handleFinishWorkout = () => {
    const finishedWorkout: WorkoutSession = {
      ...workout,
      duration: elapsedTime,
      volume: workout.exercises.reduce((acc, ex) =>
        acc + ex.sets
          .filter(s => s.completed)
          .reduce((setAcc, set) => setAcc + (set.weight * set.reps), 0), 0
      ),
    };
  
    setWorkout(finishedWorkout);
    console.log(workout);
    
  };

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <ModalWrapper
      modalType="workout"
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
          <ExerciseCard
            key={workoutExercise.id}
            workoutExercise={workoutExercise}
            onUpdateSet={(index, updates) => handleUpdateSet(workoutExercise.id, index, updates)}
            onAddSet={() => handleAddSet(workoutExercise.id)}
            onRemoveSet={() => handleRemoveSet(workoutExercise.id)}
          />
        ))}
      </main>
      {/* Finish Workout Button */}
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
