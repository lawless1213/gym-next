"use client";

import { cn } from "@/lib/utils";
import type { MuscleGroup } from "@/types";
import type { BodyViewData } from "./data/types";

const CONTOUR = {
  fill: "none",
  stroke: "var(--color-muted-foreground)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export interface BodyViewProps {
  view: BodyViewData;
  selectedMuscles?: MuscleGroup[];
  onToggleMuscle?: (muscle: MuscleGroup) => void;
}

/** Renders one body view from data (see ./data). Muscles are clickable and highlighted when selected. */
export function BodyView({ view, selectedMuscles, onToggleMuscle }: BodyViewProps) {
  const contour = { ...CONTOUR, strokeWidth: view.strokeWidth };

  return (
    <svg
      viewBox={view.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-auto">
      {view.layers.map((layer, index) =>
        layer.type === "muscle" ? (
          <g
            key={layer.id}
            id={layer.id}
            onClick={() => onToggleMuscle?.(layer.id)}
            className={cn(
              "cursor-pointer active:text-muscle lg:hover:text-muscle",
              selectedMuscles?.includes(layer.id) ? "text-muscle" : "text-background",
            )}>
            {layer.paths.map((d) => (
              <path
                key={d}
                d={d}
                fill="currentColor"
              />
            ))}
            {layer.outline?.map((d) => (
              <path
                key={d}
                d={d}
                {...contour}
              />
            ))}
          </g>
        ) : (
          <g key={`outline-${index}`}>
            {layer.lines.map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                {...contour}
              />
            ))}
            {layer.paths.map((d, i) => (
              <path
                key={i}
                d={d}
                {...contour}
              />
            ))}
          </g>
        ),
      )}
    </svg>
  );
}
