import { z } from "zod";

export const authSchema = z
	.object({
		email: z.string().email("invalid_email"),
  	password: z.string().min(6, "invalid_password"),
	});

export type AuthFormData = z.infer<typeof authSchema>;