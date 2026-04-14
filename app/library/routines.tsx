"use client";

import { useState, useMemo, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useUser } from "@/app/hooks/useUser";
import { Routine } from "../types";
import { getUserRoutines } from "../lib/services/routines";
import Loader from "../ui/common/loader";

export default function Routines() {
  const { user } = useUser();
  const userID = user?.uid;
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userID) {
      setRoutines([]);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      const data = await getUserRoutines(userID);
      setRoutines(data);
      setLoading(false);
    };
    fetchData();
  }, [userID]);

  return loading ? (
    <div className="flex items-center justify-center min-h-[300px]">
      <Loader />
    </div>
  ) : (
    <>
      <div className="space-y-3">
        {routines.map((routine) => (
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
        ))}
      </div>

      <button
        // onClick={onCreateRoutine}
        className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Create routine">
        <IconPlus className="h-6 w-6" />
      </button>
    </>
  );
}
