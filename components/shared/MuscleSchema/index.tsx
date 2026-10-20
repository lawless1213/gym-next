"use client";

import { MuscleGroup } from "@/types";
import ManBackView from "./Man/ManBackView";
import ManFrontView from "./Man/ManFrontView";
import WomanBackView from "./Woman/WomanBackView";
import WomanFrontView from "./Woman/WomanFrontView";
import { cn } from "@/lib/utils";
import { useUserPreferences } from "@/providers/UserPreferencesProvider";

type SideType = "front" | "back" | undefined;

interface MuscleSchemaProps {
  size?: "sm" | "md" | "xl";
  clickable?: boolean;
  side?: SideType;
  selectedMuscles?: MuscleGroup[];
  onToggleMuscle?: (muscle: MuscleGroup) => void;
}

export interface MuscleViewProps {
  selectedMuscles?: MuscleGroup[];
  onToggleMuscle?: (muscle: MuscleGroup) => void;
}

export default function MuscleSchema({
  clickable = true,
  size = "md",
  side,
  selectedMuscles,
  onToggleMuscle,
}: MuscleSchemaProps) {
  const { params } = useUserPreferences();
  const isMale = params.gender === "male";

  return (
    <div
      className={cn(
        "flex aspect-1/2 w-full justify-center gap-2",
        !clickable && "pointer-events-none",
        size === "sm" && "max-h-[200px]",
        size === "md" && "max-h-[400px]",
        size === "xl" && "max-h-[600px]",
      )}>
      {side !== "back" &&
        (isMale ? (
          <ManFrontView
            selectedMuscles={selectedMuscles}
            onToggleMuscle={onToggleMuscle}
          />
        ) : (
          <WomanFrontView
            selectedMuscles={selectedMuscles}
            onToggleMuscle={onToggleMuscle}
          />
        ))}
      {side !== "front" &&
        (isMale ? (
          <ManBackView
            selectedMuscles={selectedMuscles}
            onToggleMuscle={onToggleMuscle}
          />
        ) : (
          <WomanBackView
            selectedMuscles={selectedMuscles}
            onToggleMuscle={onToggleMuscle}
          />
        ))}
    </div>
  );
}
