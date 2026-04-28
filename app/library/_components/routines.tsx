"use client";

import { useState, useMemo, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useAuth } from "@/app/hooks/useAuth";
import Loader from "../../components/common/loader";
import RoutineCard from "../../components/cards/routine";
import { useRoutines } from "@/app/hooks/useServices/useRoutines";
import SkeletonBone from "@/app/components/common/skeletonBone";
import SkeletonSwitcher from "@/app/components/common/SkeletonSwitcher";
import ButtonCreate from "./buttonCreate";

const RoutinesSkeleton = (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonBone
        key={i}
        br={12}
        height={104}
      />
    ))}
  </div>
);

export default function Routines() {
  const { user } = useAuth();
  const userID = user?.uid;

  const { data: routines = [], isLoading: loading } = useRoutines(userID);

  return (
    <SkeletonSwitcher
      isLoading={loading}
      skeleton={RoutinesSkeleton}>
      <div className="space-y-3">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            {...routine}
          />
        ))}
      </div>

      <ButtonCreate onClick={() => {console.log('create routine');
      }}/>
    </SkeletonSwitcher>
  );
}
