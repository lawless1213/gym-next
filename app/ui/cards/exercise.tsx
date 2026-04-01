"use client";

import { Exercise } from "@/app/types/exercise";
import { Button } from "../buttons/button";
import { IconHeart, IconCameraOff, IconVideo, IconVideoFilled, IconHeartFilled } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [isFav, setIsFav] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  const favButtonHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setIsFav(!isFav);
  };

  const videoButtonHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setIsVideo(!isVideo);
  };

  return (
    <Link
      href={`/exercise?id=${exercise.id}`}
      className="flex flex-col rounded-md bg-panel">
      <div className="flex gap-2 justify-between items-center p-4">
        <div className="flex flex-col gap-2 ">
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
      <div className="h-40 bg-white flex items-center justify-center relative">
        {exercise.preview ? (
          <Image
            src={exercise.preview}
            alt={exercise.name}
            width={300}
            height={300}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <IconCameraOff size={40} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <p className="text-xl font-bold">{exercise.name}</p>
      </div>
    </Link>
  );
}
