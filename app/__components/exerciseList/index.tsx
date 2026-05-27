"use client";

import { Exercise } from "@/app//types";
import { IconBarbell, IconMenu2, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { cn } from "@/app/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "motion/react";
import { useSwipeable } from "react-swipeable";
import { deleteUserExercise } from "@/app/lib/actions/exercise";
import { useAuth } from "@/app/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useModal } from "@/app/lib/modal/modal-store";

interface ExerciseListItemProps {
  exercise: Exercise;
}

export function ExerciseListItem({ exercise }: ExerciseListItemProps) {
  const { confirm } = useModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const t = useTranslations("components.exerciseCard");
  const [isEditable, setIsEditable] = useState(false);

  const handlers = exercise.isCustom
    ? useSwipeable({
        onSwipedLeft: (e) => {
          e.event.stopPropagation();
          setIsEditable(true);
        },
        onSwipedRight: (e) => {
          e.event.stopPropagation();
          setIsEditable(false);
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
      })
    : {};

  const deleteHandler = async () => {
    try {
      if (!user) throw new Error("Not authenticated");
      setIsEditable(false);
      
      const ok = await confirm({
        title: "",
        description: `Впевнені у видаленні ${exercise.name}?`,
        cancelLabel: " Ні",
        confirmLabel: "Так",
      });

      if (ok) {
        await deleteUserExercise(user.uid, exercise.id, exercise.imageUrl);

        queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
        queryClient.invalidateQueries({ queryKey: ["routines", user.uid] });
        toast.success("Вправу успішно видалено!");
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const editHandler = async () => {
    try {
      if (!user) throw new Error("Not authenticated");
      setIsEditable(false);


    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div
      className="relative flex overflow-hidden md:rounded-xl"
      {...handlers}>
      <motion.div
        className="flex w-full items-center gap-3 bg-card p-3 text-left"
        animate={{ x: isEditable ? -80 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
          {exercise.imageUrl ? (
            <Image
              width={100}
              height={100}
              src={exercise.imageUrl}
              alt={exercise.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <IconBarbell className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium text-foreground">{exercise.name}</h3>
            {exercise.isCustom && <span className="shrink-0 rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">{t("custom")}</span>}
          </div>
          <p className="truncate text-sm text-muted-foreground">{exercise.muscleGroup}</p>
        </div>

        {exercise.isCustom && (
          <div
            onClick={() => setIsEditable(!isEditable)}
            className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
            
            {
              isEditable ?
              <IconX className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />
              :
              <IconMenu2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />
            }
          </div>
        )}
      </motion.div>
      {exercise.isCustom && (
        <motion.div
          className="absolute top-0 right-0 h-full flex text-white"
          initial={{ x: 80 }}
          animate={{ x: isEditable ? 0 : 80 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <div
            onClick={editHandler}
            className="flex items-center justify-center w-10 h-full bg-primary cursor-pointer hover:brightness-110">
            <IconEdit className="h-5 w-5" />
          </div>
          <div
            onClick={deleteHandler}
            className="flex items-center justify-center w-10 h-full bg-red-500 cursor-pointer hover:brightness-110">
            <IconTrash className="h-5 w-5" />
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface ExerciseCategoryProps {
  title: string;
  exercises: Exercise[];
}

export function ExerciseCategory({ title, exercises }: ExerciseCategoryProps) {
  return (
    <div className="space-y-2">
      <h3 className="px-1 text-sm font-semibold text-muted-foreground">{title}</h3>
      <div className="space-y-2">
        {exercises.map((exercise) => (
          <ExerciseListItem
            key={exercise.id}
            exercise={exercise}
          />
        ))}
      </div>
    </div>
  );
}
