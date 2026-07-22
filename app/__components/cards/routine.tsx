import { useAuth } from "@/app/hooks/useAuth";
import { deleteUserRoutine } from "@/app/lib/actions/routine";
import { useModal } from "@/app/lib/modal/modal-store";
import { Routine } from "@/app/types";
import { IconPlayerPlay, IconChecks, IconX, IconMenu2, IconEdit, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { ExerciseCard } from "../exerciseList";

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
        title: "",
        description: `Впевнені у видаленні ${routine.name}?`,
        cancelLabel: " Ні",
        confirmLabel: "Так",
      });

      if (ok) {
        await deleteUserRoutine(user.uid, routine.id);

        queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
        queryClient.invalidateQueries({ queryKey: ["routines", user.uid] });
        toast.success("Програму видалено!");
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
    className="overflow-hidden md:rounded-xl"
    >
      <div
        key={routine.id}
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative "
        {...handlers}>
        <motion.div
          className="bg-card p-4 flex gap-2 w-full items-center justify-between"
          
          animate={{ x: routine.editable && isEditable ? -80 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <div>
            <h3 className="font-semibold text-foreground">{routine.name}</h3>
            <p className="text-sm text-muted-foreground">
              {t("amount")}: {routine.exercises.length}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {!routine.exercises.length && <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{t("emptyExercises")}</span>}
              {routine.exercises.slice(0, 3).map((ex) => (
                <span
                  key={ex.id}
                  className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  {ex.name}
                </span>
              ))}
              {routine.exercises.length > 3 && <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">+{routine.exercises.length - 3}</span>}
            </div>
          </div>

          {routine.available && !routine.completed && (
            <button
              onClick={() => open("workout", routine)}
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
              <IconPlayerPlay className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />
            </button>
          )}

          {routine.completed && (
            <div className="px-2">
              <IconChecks className="h-5 w-5 text-primary" />
            </div>
          )}

          {routine.editable && (
            <button
              onClick={(e) => {e.stopPropagation(); setIsEditable(!isEditable)}}
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
              {isEditable ? <IconX className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" /> : <IconMenu2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />}
            </button>
          )}
        </motion.div>
        {routine.editable && (
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
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="overflow-hidden border-t border-dashed border-muted-foreground/20 flex flex-col"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}>
            {routine.exercises.map((exercise, exerciseIndex) => (
              <ExerciseCard exercise={exercise} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
