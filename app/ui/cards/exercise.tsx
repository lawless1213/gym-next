"use client";

import { Exercise } from "@/app/types/exercise";
import { Button } from "../buttons/button";
import { IconHeart, IconCameraOff, IconVideo, IconVideoFilled, IconHeartFilled } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

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
    <div className="flex flex-col rounded-md bg-panel">
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
        <div className="flex gap-1">
          <Button
            button={{
              onClick: favButtonHandler,
              icon: isFav ? <IconHeartFilled size={20} /> : <IconHeart size={20} />,
              border: true,
              big: true,
            }}
          />
        </div>
      </div>
      <div className="h-40 bg-white flex items-center justify-center relative">
        {isVideo ? (
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
        ) : exercise.preview ? (
          <Image
            src={exercise.preview}
            alt={exercise.name}
            width={300}
            height={300}
            className="w-full h-full object-contain"
          />
        ) : (
          <IconCameraOff
            size={30}
            className="text-gray-400 m-auto"
          />
        )}

        {exercise.video &&
          (isVideo ? (
            <Button
              button={{
                onClick: videoButtonHandler,
                icon: <IconVideoFilled size={20} />,
                classes: "absolute right-2 bottom-2 w-10 h-10",
                border: false,
              }}
            />
          ) : (
            <Button
              button={{
                onClick: videoButtonHandler,
                icon: <IconVideo size={20} />,
                classes: "absolute right-2 bottom-2 w-10 h-10",
                border: false,
              }}
            />
          ))}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <p className="text-xl font-bold">{exercise.name}</p>
        <p className="text-md">{exercise.description}</p>
        <p className="text-sm text-gray-400">{exercise.type === "time" ? `${exercise.valuePerSet} exercise.time.per.set` : `${exercise.valuePerSet} exercise.reps.per.set`}</p>
        <p className="text-sm text-gray-400 ml-auto">{exercise.caloriesPerUnit} exercise.calories.per.unit</p>
      </div>
    </div>
  );
}
