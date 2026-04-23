import { useQuery } from "@tanstack/react-query";
import { getUserHistoryForPeriod, getUserLastHistory } from "@/app/lib/services/history";

export const useHistoryForPeriod= (userId: string | undefined, start: Date, end: Date) => {
  return useQuery({
    queryKey: ["historyForPeriod", { userId, start: start.toISOString(), end: end.toISOString() }],
    queryFn: () => getUserHistoryForPeriod(userId!, start, end),
    staleTime: 1000 * 60 * 60 * 6, // 6 hour
    enabled: !!userId,
  });
};

export const useLastHistory= (userId: string | undefined, amount: number) => {
  return useQuery({
    queryKey: ["lastHistory", { userId, amount }],
    queryFn: () => getUserLastHistory(userId!, amount),
    staleTime: 1000 * 60 * 60 * 6, // 6 hour
    enabled: !!userId,
  });
};