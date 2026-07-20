"use client";

import { Exercise } from "@/app/types";
import { IconMenu2, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useSwipeable } from "react-swipeable";
import { deleteUserExercise } from "@/app/lib/actions/exercise";
import { useAuth } from "@/app/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useModal } from "@/app/lib/modal/modal-store";
import { ExerciseCard } from "./exerciseCard";

export { ExerciseCard } from "./exerciseCard";
export type { ExerciseCardProps, ExerciseCardData } from "./exerciseCard";

interface ExerciseListItemProps {
  exercise: Exercise;
}

export function ExerciseListItem({ exercise }: ExerciseListItemProps) {
  const { confirm, open } = useModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditable, setIsEditable] = useState(false);
  const canEdit = exercise.isCustom;

  const handlers = useSwipeable(
    canEdit
      ? {
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
        }
      : {},
  );

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
      open("exerciseEdit", { exercise: exercise });
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
        className="w-full"
        animate={{ x: isEditable ? -80 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}>
        <ExerciseCard
          exercise={exercise}
          trailing={
            canEdit ? (
              <div
                onClick={() => setIsEditable(!isEditable)}
                className="group flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-solid border-transparent bg-secondary transition-[0.2s] hover:border-primary">
                {isEditable ? (
                  <IconX className="h-5 w-5 text-muted-foreground transition-[0.2s] group-hover:text-primary" />
                ) : (
                  <IconMenu2 className="h-5 w-5 text-muted-foreground transition-[0.2s] group-hover:text-primary" />
                )}
              </div>
            ) : undefined
          }
        />
      </motion.div>
      {canEdit && (
        <motion.div
          className="absolute top-0 right-0 flex h-full text-white"
          initial={{ x: 80 }}
          animate={{ x: isEditable ? 0 : 80 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <div
            onClick={editHandler}
            className="flex h-full w-10 cursor-pointer items-center justify-center bg-primary hover:brightness-110">
            <IconEdit className="h-5 w-5" />
          </div>
          <div
            onClick={deleteHandler}
            className="flex h-full w-10 cursor-pointer items-center justify-center bg-red-500 hover:brightness-110">
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
