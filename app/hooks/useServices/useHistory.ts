import { useQuery } from "@tanstack/react-query";
import { getUserHistory } from "@/app/lib/services/history";
import { HistoryOptions } from "@/app/types";

export const useHistory = (
  userId: string | undefined,
  options: HistoryOptions
) => {
  return useQuery({
    queryKey: ["history", { userId, ...options }],
    queryFn: () => getUserHistory(userId!, options),
    staleTime: 1000 * 60 * 60 * 6,
    enabled: !!userId,
  });
};