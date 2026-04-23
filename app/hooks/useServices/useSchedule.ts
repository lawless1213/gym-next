import { useQuery } from "@tanstack/react-query";
import { getUserSchedule } from "@/app/lib/services/schedule";

export const useSchedule = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["schedule", userId],
    queryFn: () => getUserSchedule(userId!),
    staleTime: 1000 * 60 * 60 * 6, // 6 hour
    enabled: !!userId,
  });
};