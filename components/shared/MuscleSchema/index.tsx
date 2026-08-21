"use client";

import ManBackView from "./Man/ManBackView";
import ManFrontView from "./Man/ManFrontView";
import WomanBackView from "./Woman/WomanBackView";
import WomanFrontView from "./Woman/WomanFrontView";

type SideType = "front" | "back" | undefined;

interface MuscleSchemaProps {
	male?: boolean;
	side?: SideType;
}

export default function MuscleSchema({male = true, side}: MuscleSchemaProps) {
  return (
    <div className="flex gap-2 max-h-[600px] aspect-1/2 justify-center">
      {side !== "back" && (male ? <ManFrontView/> : <WomanFrontView/>)}
			{side !== "front" && (male ? <ManBackView /> : <WomanBackView/>)}
    </div>
  );
}
