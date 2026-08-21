import { MUSCLE_GROUPS } from "@/data/exercise";
import { z } from "zod";

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const exerciseSchema = z.object({
  photo: z
    .union([
      z.instanceof(File),
      z.string().url(),
    ])
    .optional()
    .refine((file) => {
      if (!file) return true;
      if (file instanceof File) return file.size <= MAX_FILE_SIZE;
      return true;
    }, "file_too_large")
    .refine((file) => {
      if (!file) return true;
      if (file instanceof File) return ACCEPTED_IMAGE_TYPES.includes(file.type);
      return true;
    }, "invalid_file_type"),
  title: z.string().min(3, "title_too_small").max(100, "title_too_large"),
  groups: z.array(z.enum(MUSCLE_GROUPS)).min(1, "at_least_one_checked"),
  description: z.string().min(3, "text_too_small").max(300, "text_too_large"),
});

export type ExerciseFormData = z.infer<typeof exerciseSchema>;