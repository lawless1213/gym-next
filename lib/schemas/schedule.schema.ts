import { z } from "zod";

export const scheduleSchema = z.object({
	routines: z.array(z.object({ routineId: z.string() })),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;