import { useQuery } from "@tanstack/react-query";
import { getUserHistory } from "@/lib/services/history";
import { HistoryOptions } from "@/types";
import { queryKeys } from "@/lib/queryKeys";

export const useHistory = (userId: string | undefined, options: HistoryOptions) => {
  return useQuery({
    queryKey: queryKeys.history.list(userId, options),
    queryFn: () => getUserHistory(userId!, options),
    staleTime: 1000 * 60 * 60 * 6,
    enabled: !!userId,
  });
};
