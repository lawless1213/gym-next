"use client";

import { MuscleGroup } from "@/types";
import ManBackView from "./Man/ManBackView";
import ManFrontView from "./Man/ManFrontView";
import WomanBackView from "./Woman/WomanBackView";
import WomanFrontView from "./Woman/WomanFrontView";

type SideType = "front" | "back" | undefined;

interface MuscleSchemaProps {
	male?: boolean;
	side?: SideType;
  selectedMuscles?: MuscleGroup[];
}

export interface MuscleViewProps {
  selectedMuscles?: MuscleGroup[];
}

export default function MuscleSchema({male = true, side, selectedMuscles}: MuscleSchemaProps) {
  return (
    <div className="w-full flex gap-2 max-h-[600px] aspect-1/2 justify-center">
      {side !== "back" && (male ? <ManFrontView selectedMuscles={selectedMuscles} /> : <WomanFrontView selectedMuscles={selectedMuscles} />)}
      {side !== "front" && (male ? <ManBackView selectedMuscles={selectedMuscles} /> : <WomanBackView selectedMuscles={selectedMuscles} />)}
    </div>
  );
}
