import { useAuth } from "@/hooks/useAuth";
import { deleteUserRoutine } from "@/lib/actions/routine";
import { useModal } from  "@/components/modals/modal-store";
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

export default function RoutineCard(routine: Routine) {
  const t = useTranslations("components.routineCard");
  const { confirm, open } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditable, setIsEditable] = useState(false);

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

        queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
        queryClient.invalidateQueries({ queryKey: ["routines", user.uid] });
        toast.success(t("deleteSuccess"));
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const editHandler = async () => {
    try {
      if (!user) throw new Error("Not authenticated");
      open("routineEdit", { routine: routine });
      setIsEditable(false);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div
      style={{ borderLeft: `4px solid ${routine.color}` }}
      className="overflow-hidden md:rounded-xl">
      <div
        key={routine.id}
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative "
        {...handlers}>
        <motion.div
          className="bg-card p-4 flex gap-2 w-full items-center"
          animate={{ x: routine.editable && isEditable ? -72 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <div className="mr-auto">
            <h3 className="font-semibold text-foreground">{routine.name}</h3>
            <p className="text-sm text-muted-foreground">
              {t("amount")}: {routine.exercises.length}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {!routine.exercises.length && <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{t("emptyExercises")}</span>}
              {routine.exercises.length > 3 && <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">+{routine.exercises.length - 3}</span>}
            </div>
          </div>

          {routine.available && !routine.completed && (
            <Button
              size="icon-lg"
              onClick={() => open("workout", routine)}
              className="shrink-0">
              <IconPlayerPlayFilled className="size-5" />
            </Button>
          )}

          {routine.completed && (
            <div className="px-2 shrink-0">
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
                  {isEditable ? <IconX className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" /> : <IconMenu2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />}
                </Button>
              </TooltipTrigger>
              {!isEditable && <TooltipContent side="left">{t("options")}</TooltipContent>}
            </Tooltip>
          )}
        </motion.div>
        {routine.editable && (
          <motion.div
            className="absolute top-0 right-0 h-full flex text-white"
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
            className="overflow-hidden border-t border-dashed border-muted-foreground/20 flex flex-col"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}>
            {routine.exercises.map((exercise, exerciseIndex) => (
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
