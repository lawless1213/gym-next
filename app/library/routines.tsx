"use client";

import { useState, useMemo, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useUser } from "@/app/hooks/useUser";
import { Routine } from "../types";
import { getUserRoutines } from "../lib/services/routines";
import Loader from "../ui/common/loader";
import RoutineCard from "../ui/cards/routine";


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
          <RoutineCard key={routine.id} {...routine} />
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
