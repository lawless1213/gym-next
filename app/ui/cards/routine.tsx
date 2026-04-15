import { Routine } from "@/app/types";

export default function RoutineCard(routine: Routine) {
	console.log(routine);
	

  return (
    <div
      key={routine.id}
      className="rounded-xl bg-card p-4"
      style={{ borderLeft: `4px solid ${routine.color}` }}>
      <h3 className="font-semibold text-foreground">{routine.name}</h3>
      <p className="text-sm text-muted-foreground">{routine.exercises.length} exercises</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {routine.exercises.slice(0, 3).map((ex) => (
          <span
            key={ex.id}
            className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {ex.name}
          </span>
        ))}
        {routine.exercises.length > 3 && <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">+{routine.exercises.length - 3} more</span>}
      </div>
    </div>
  );
}
