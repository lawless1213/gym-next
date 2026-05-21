"use client";

import { ModalWrapper } from "../modal-wrapper";
import { IconArrowLeft, IconBarbell, IconCheck, IconClock, IconPlayerPauseFilled, IconPlayerPlay, IconUpload, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useWorkoutModal } from "@/app/hooks/ useModals/useWorkoutModal";
import { ExerciseCard } from "./_components/exerciseCard";
import { WorkoutSession } from '@/app/types';


export function WorkoutModal() {
  const { close, routine } = useWorkoutModal();

  useEffect(() => {
    console.log(routine);
  }, []);
  

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
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const workoutRoutine: WorkoutSession = {
    routineId: routine.id,
    routineName: routine.name,
    startedAt: new Date().toISOString(),
    exercises: routine.exercises.map((exercise) => ({
      ...exercise,
      sets: Array.from({ length: 3 }, () => ({
        completed: false,
        reps: 0,
        weight: 0,
      })),
    })),
  };

  const totalSets = workoutRoutine.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = workoutRoutine.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;


  return (
    <ModalWrapper
      modalType="workout"
      size="large"
      header={false}
      title={routine.name}
      contentClasses="pt-0"
    >
      <header className="sticky top-0 z-40 border-b border-border bg-card backdrop-blur">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <IconPlayerPlay className="h-5 w-5" /> : <IconPlayerPauseFilled className="h-5 w-5" />}
          </button>
          
          <div className="text-center">
            <h1 className="font-bold text-foreground">{routine.name}</h1>
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

      <main className="flex-1 space-y-4 p-4">
        {workoutRoutine.exercises.map((workoutExercise ) => (
          <ExerciseCard
            key={workoutExercise.id}
            workoutExercise={workoutExercise}
            onUpdateSet={(setId, updates) =>
              // handleUpdateSet(workoutExercise.id, setId, updates)
              console.log('dfgf')
            }
            onAddSet={() => console.log('dfgf')}
          />
        ))}
      </main>
      <div className="flex flex-col gap-4">
      
      </div>
    </ModalWrapper>
  );
}
