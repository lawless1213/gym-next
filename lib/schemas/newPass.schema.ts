import { z } from "zod";

export const newPassSchema = z
	.object({
		password: z.string().min(6, "invalid_password"),
		confirmPassword: z.string().min(6, "invalid_password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
    message: "passwords_do_not_match",
    path: ["confirmPassword"],
  });

export type newPassFormData = z.infer<typeof newPassSchema>;