"use client";

import { MuscleGroup } from "@/types";
import ManBackView from "./Man/ManBackView";
import ManFrontView from "./Man/ManFrontView";
import WomanBackView from "./Woman/WomanBackView";
import WomanFrontView from "./Woman/WomanFrontView";
import { cn } from "@/lib/utils";

type SideType = "front" | "back" | undefined;

interface MuscleSchemaProps {
  size?: "sm" | "md" | "xl";
  male?: boolean;
  clickable?: boolean;
  side?: SideType;
  selectedMuscles?: MuscleGroup[];
  onToggleMuscle?: (muscle: MuscleGroup) => void;
}

export interface MuscleViewProps {
  selectedMuscles?: MuscleGroup[];
  onToggleMuscle?: (muscle: MuscleGroup) => void;
}

export default function MuscleSchema({ male = true, clickable = true, size = "md", side, selectedMuscles, onToggleMuscle }: MuscleSchemaProps) {
  return (
    <div className={cn("w-full flex gap-2 aspect-1/2 justify-center", !clickable && 'pointer-events-none', size === "sm" && "max-h-[200px]", size === "md" && "max-h-[400px]", size === "xl" && "max-h-[600px]")}>
      {side !== "back" &&
        (male ? (
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
        (male ? (
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
