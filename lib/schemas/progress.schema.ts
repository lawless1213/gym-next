import { z } from "zod";
import { positiveNumber } from "./common.schema";

export const progressSchema = z
  .object({
    date: z.date(),
    weight: positiveNumber(300).optional(),
    waist: positiveNumber(200).optional(),
    chest: positiveNumber(200).optional(),
    arms: positiveNumber(100).optional(),
    thighs: positiveNumber(150).optional(),
  })
  .refine(
    (data) => [data.weight, data.waist, data.chest, data.arms, data.thighs].some((v) => v !== undefined),
    { message: "at_least_one_required", path: ["root"] }
  );

export type ProgressFormData = z.infer<typeof progressSchema>;