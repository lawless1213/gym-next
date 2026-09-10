import { z } from "zod";

export const newEmailSchema = z.object({
  email: z.string().email("invalid_email"),
});

export type newEmailFormData = z.infer<typeof newEmailSchema>;
