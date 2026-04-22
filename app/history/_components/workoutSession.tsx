import { IconClock, IconBarbell } from "@tabler/icons-react";
import { useState } from "react";
import { WorkoutSession as WorkoutSessionType } from "@/app/types";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

export default function WorkoutSession(workout: WorkoutSessionType) {
  const t = useTranslations("History");
  const tMonth = useTranslations("components.month");
  const [isOpen, setIsOpen] = useState(false);

  const date = new Date(workout.startedAt);
  const volume = workout.volume ?? 0;

  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      aria-expanded={isOpen}
      className="w-full rounded-xl bg-card text-left cursor-pointer transition-colors hover:bg-secondary"
    >
      <div className="flex w-full items-center gap-4 p-4">
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary">
          <span className="text-xs font-medium text-muted-foreground">{tMonth(`short.${String(date.getMonth() + 1)}`)}</span>
          <span className="text-lg font-bold text-foreground">{date.getDate()}</span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{workout.routineName}</h3>
          </div>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <IconClock className="h-3.5 w-3.5" />
              {workout.duration}m
            </span>
            <span className="flex items-center gap-1">
              <IconBarbell className="h-3.5 w-3.5" />
              {workout.exercises.length}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="font-semibold text-foreground">{volume >= 1000 ? `${(volume / 1000).toFixed(1)}K` : volume}</p>
          <p className="text-xs text-muted-foreground">{t("list.kg")}</p>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="overflow-hidden px-4 border-t border-dashed border-muted-foreground flex flex-col"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {workout.exercises.map((exercise, exerciseIndex) => (
              <div
                key={`${exercise.exerciseId}-${exerciseIndex}`}
                className="flex flex-wrap items-center justify-between gap-2 py-2"
              >
                <p className="shrink-0 text-sm font-medium">{exercise.name}</p>
                <div className="flex flex-wrap gap-2">
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={`${exercise.exerciseId}-${setIndex}`}
                      className={`rounded-xl bg-secondary px-4 py-1 ${set.completed ? "border border-primary" : ""}`}
                    >
                      <span className="text-xs text-foreground">
                        {set.reps}x{set.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
