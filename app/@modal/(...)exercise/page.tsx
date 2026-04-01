"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getExercise } from "@/app/lib/services/exercises";
import type { Exercise } from "@/app/types/exercise";
import { Modal } from "@/app/ui/modal";
import { IconLoader2 } from "@tabler/icons-react";

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
        children:
          exercise && !isLoading ? (
            <div className="flex flex-wrap gap-4 justify-center">
              <div>
                <div className="max-w-[400px]">
                  {exercise.video && (
                    <video
                      className="w-full h-full object-contain rounded-md"
                      src={exercise.video}
                      autoPlay
                      muted
                      loop>
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex gap-1">
                    {exercise.equipment.map((equipment) => (
                      <span
                        key={equipment}
                        className="px-2 bg-primary-1 rounded-4xl text-sm font-medium capitalize">
                        {equipment}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {exercise.bodyPart.map((bodyPart) => (
                      <span
                        key={bodyPart}
                        className="px-2 bg-primary-1/50 rounded-4xl text-sm font-medium text-primary-2 capitalize">
                        {bodyPart}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
                <div className="flex-1 sm:min-w-[400px] ">
                  <h1 className="text-2xl font-bold">Exercise {exercise.name}</h1>
                  <p className="text-sm text-gray-500">by {exercise.description}</p>
                  <p className="text-md mt-4">Instruction:</p>
                  <ul className="flex flex-col gap-2 mt-1">
                    {exercise.instruction.map((item, index) => (
                      <li key={item} className="p-2 border border-panel rounded-md flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-500">{index + 1}</span> 
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                </div>
            </div>
          ) : (
            <div>Exercise not found</div>
          ),
      }}
    />
  );
}
