import { useQuery } from "@tanstack/react-query";
import { getUserSchedule } from "@/lib/services/schedule";
import { queryKeys } from "@/lib/queryKeys";

export const useSchedule = (userId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.schedule(userId),
    queryFn: () => getUserSchedule(userId!),
    staleTime: 1000 * 60 * 60 * 6, // 6 hour
    enabled: !!userId,
  });
};
