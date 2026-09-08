import { z } from "zod";

export const reauthSchema = z.object({
  password: z.string().min(1, "password_required"),
});

export type ReauthFormData = z.infer<typeof reauthSchema>;