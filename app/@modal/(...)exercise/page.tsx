"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getExercise } from "@/app/lib/services/exercises";
import type { Exercise } from "@/app/types/exercise";
import { Modal } from "@/app/ui/modal";

export default function ExercisePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [exerciseId, setExerciseId] = useState<string | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");

    if (!id) {
      return;
    }

    setExerciseId(id);
    router.replace("/exercise", { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    if (!exerciseId) return;

    const loadExercise = async () => {
      setIsLoading(true);
      const data = await getExercise(exerciseId);
      setExercise(data);
      setIsLoading(false);
    };

    void loadExercise();
  }, [exerciseId]);

  return (
    <Modal
      modal={{
        loading: isLoading,
        size: "large",
        title: isLoading ? "" : exercise?.name,
        children: (
          <div>
            <h1>Exercise {exercise?.name}</h1>
            !!exercise.video && (
            <video
              className="w-full h-full object-contain"
              src={exercise.video}
              autoPlay
              muted
              loop>
              Your browser does not support the video tag.
            </video>
            )
          </div>
        ),
      }}
    />
  );
}
