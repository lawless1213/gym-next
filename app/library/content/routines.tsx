"use client";

import { useState, useMemo, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useAuth } from "@/app/hooks/useAuth";
import Loader from "../../components/common/loader";
import RoutineCard from "../../components/cards/routine";
import { useRoutines } from "@/app/hooks/useServices/useRoutines";


export default function Routines() {
  const { user } = useAuth();
  const userID = user?.uid;

  const { data: routines = [], isLoading: loading } = useRoutines(userID);

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
