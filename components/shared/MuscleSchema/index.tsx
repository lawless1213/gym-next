"use client";

import { MuscleGroup } from "@/types";
import { BodyView } from "./BodyView";
import { MAN_BACK } from "./data/manBack";
import { MAN_FRONT } from "./data/manFront";
import { WOMAN_BACK } from "./data/womanBack";
import { WOMAN_FRONT } from "./data/womanFront";
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
      {side !== "back" && (
        <BodyView
          view={isMale ? MAN_FRONT : WOMAN_FRONT}
          selectedMuscles={selectedMuscles}
          onToggleMuscle={onToggleMuscle}
        />
      )}
      {side !== "front" && (
        <BodyView
          view={isMale ? MAN_BACK : WOMAN_BACK}
          selectedMuscles={selectedMuscles}
          onToggleMuscle={onToggleMuscle}
        />
      )}
    </div>
  );
}
