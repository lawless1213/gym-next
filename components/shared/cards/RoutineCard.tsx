import { useAuth } from "@/hooks/useAuth";
import { deleteUserRoutine } from "@/lib/mutations/routine";
import { useModal } from "@/components/modals/ModalProvider";
import { Routine } from "@/types";
import { IconChecks, IconX, IconMenu2, IconEdit, IconTrash, IconPlayerPlayFilled } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { ExerciseCard } from "@/components/shared/cards/ExerciseCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { Button } from "../../ui/Button";
import { queryKeys } from "@/lib/queryKeys";

interface RoutineListItemProps {
  routine: Routine;
  /** Controlled mode (e.g. accordion in RoutinesList). Omit both to let the card manage its own state. */
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function RoutineCard({ routine, isOpen: controlledIsOpen, onToggle }: RoutineListItemProps) {
  const t = useTranslations("components.routineCard");
  const { confirm, open } = useModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditable, setIsEditable] = useState(false);
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;
  const toggle = () => {
    if (isControlled) onToggle?.();
    else setUncontrolledIsOpen((prev) => !prev);
  };

  const handlers = useSwipeable(
    routine.editable
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
        title: routine.name,
        description: t("delete"),
      });

      if (ok) {
        await deleteUserRoutine(user.uid, routine.id);

        queryClient.invalidateQueries({ queryKey: queryKeys.userExercises(user.uid) });
        queryClient.invalidateQueries({ queryKey: queryKeys.routines(user.uid) });
        toast.success(t("deleteSuccess"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editHandler = async () => {
    try {
      if (!user) throw new Error("Not authenticated");
      open("routineEdit", { routine: routine });
      setIsEditable(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{ borderLeft: `6px solid ${routine.color}` }}
      className="overflow-hidden md:rounded-xl">
      <div
        key={routine.id}
        onClick={() => {
          if (!isEditable && routine.exercises.length > 0) toggle();
        }}
        className={`relative ${routine.exercises.length > 0 ? "cursor-pointer" : ""}`}
        {...handlers}>
        <motion.div
          className="flex w-full items-center gap-2 bg-card p-4"
          animate={{ x: routine.editable && isEditable ? -72 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <div className="mr-auto">
            <h3 className="font-semibold text-foreground">{routine.name}</h3>
            <p className="text-sm text-muted-foreground">
              {t("amount")}: {routine.exercises.length}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {!routine.exercises.length && (
                <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  {t("emptyExercises")}
                </span>
              )}
              {routine.exercises.length > 3 && (
                <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  +{routine.exercises.length - 3}
                </span>
              )}
            </div>
          </div>

          {routine.available && !routine.completed && (
            <Button
              size="icon-lg"
              onClick={(e) => {
                e.stopPropagation();
                open("workout", routine);
              }}
              className="shrink-0">
              <IconPlayerPlayFilled className="size-5" />
            </Button>
          )}

          {routine.completed && (
            <div className="shrink-0 px-2">
              <IconChecks className="h-5 w-5 text-primary" />
            </div>
          )}

          {routine.editable && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditable(!isEditable);
                  }}
                  className="hrink-0">
                  {isEditable ? (
                    <IconX className="h-5 w-5 text-muted-foreground transition-[0.2s] group-hover:text-primary" />
                  ) : (
                    <IconMenu2 className="h-5 w-5 text-muted-foreground transition-[0.2s] group-hover:text-primary" />
                  )}
                </Button>
              </TooltipTrigger>
              {!isEditable && <TooltipContent side="left">{t("options")}</TooltipContent>}
            </Tooltip>
          )}
        </motion.div>
        {routine.editable && (
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
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="flex flex-col overflow-hidden border-t border-dashed border-muted-foreground/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}>
            {routine.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                preview={exercise.id?.startsWith("temp-")}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
