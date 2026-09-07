import { z } from "zod";
import { positiveNumber } from "./common.schema";

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const userSchema = z.object({
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
  name: z.string().min(2, "name_too_small").max(100, "name_too_large"),
  height: positiveNumber(300).optional(),
});

export type userFormData = z.infer<typeof userSchema>;