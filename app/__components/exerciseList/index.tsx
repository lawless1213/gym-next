"use client";

import { Exercise } from "@/types";
import { IconMenu2, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useSwipeable } from "react-swipeable";
import { deleteUserExercise } from "@/app/lib/actions/exercise";
import { useAuth } from "@/app/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useModal } from "@/app/lib/modal/modal-store";
import { ExerciseCard } from "../../../components/shared/cards/ExerciseCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { useTranslations } from "next-intl";
import { Button } from "../../../components/ui/Button";

export { ExerciseCard } from "../../../components/shared/cards/ExerciseCard";
export type { ExerciseCardProps, ExerciseCardData } from "../../../components/shared/cards/ExerciseCard";

interface ExerciseListItemProps {
  exercise: Exercise;
}

export function ExerciseListItem({ exercise }: ExerciseListItemProps) {
  const t = useTranslations("components.exerciseCard");
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
        title: exercise.name,
        description: t('delete')
      });

      if (ok) {
        await deleteUserExercise(user.uid, exercise.id, exercise.imageUrl);

        queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
        queryClient.invalidateQueries({ queryKey: ["routines", user.uid] });
        toast.success(t('deleteSuccess'));
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
        animate={{ x: isEditable ? -72 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}>
        <ExerciseCard
          exercise={exercise}
          trailing={
            canEdit ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-xl"
                    onClick={() => setIsEditable(!isEditable)}
                    className="shrink-0">
                    {isEditable ? <IconX className="size-5" /> : <IconMenu2 className="size-5" />}
                  </Button>
                </TooltipTrigger>
                {!isEditable && <TooltipContent side="left">{t("options")}</TooltipContent>}
              </Tooltip>
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
          <Button
            size="icon"
            onClick={editHandler}
            className="h-full rounded-none">
            <IconEdit className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={deleteHandler}
            className="h-full rounded-none">
            <IconTrash className="size-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
