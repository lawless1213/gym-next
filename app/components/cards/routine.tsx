import { Routine } from "@/app/types";
import { IconPlayerPlay, IconChecks } from "@tabler/icons-react";
import { useTranslations } from "next-intl";


export default function RoutineCard(routine: Routine) {
  const t = useTranslations("components.routineCard");

  return (
    <div
      key={routine.id}
      className="rounded-xl bg-card p-4 flex gap-2 items-center justify-between"
      style={{ borderLeft: `4px solid ${routine.color}` }}>
      <div>
        <h3 className="font-semibold text-foreground">
          {routine.name}
        </h3>
        <p className="text-sm text-muted-foreground">{t("amount")}: {routine.exercises.length}</p>
        <div className="mt-2 flex flex-wrap gap-1">
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
      {routine.completed ? (
        <IconChecks className="h-5 w-5 text-primary" />
      ) : (
        routine.completed === false && (
          <button
            onClick={() => console.log("starts")}
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-secondary cursor-pointer border-2 border-transparent border-solid hover:border-primary transition-[0.2s]">
            <IconPlayerPlay className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-[0.2s]" />
          </button>
        )
      )}
    </div>
  );
}
