import type { MuscleGroup } from "@/types";

/**
 * One body view (front/back, male/female) as plain data, rendered by `BodyView`.
 * Layers are drawn in order: a muscle layer is a clickable filled area (plus optional
 * contour strokes inside it), an outline layer is the body contour.
 */
export type BodyLayer =
  | { type: "muscle"; id: MuscleGroup; paths: string[]; outline?: string[] }
  | { type: "outline"; paths: string[]; lines: [x1: number, y1: number, x2: number, y2: number][] };

export interface BodyViewData {
  viewBox: string;
  /** Contour stroke width in viewBox units. */
  strokeWidth: number;
  layers: BodyLayer[];
}
