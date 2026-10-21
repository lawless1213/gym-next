import { useQuery } from "@tanstack/react-query";
import { getUserLastProgress } from "@/lib/services/progress";
import { queryKeys } from "@/lib/queryKeys";

export const useLastProgress = (userId: string | undefined, amount: number = 10) => {
  return useQuery({
    queryKey: queryKeys.progress.last(userId, amount),
    queryFn: () => getUserLastProgress(userId!, amount),
    staleTime: 1000 * 60 * 60 * 6, // 6 hour
    enabled: !!userId,
  });
};
