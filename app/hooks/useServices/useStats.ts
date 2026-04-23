import { useQuery } from "@tanstack/react-query";
import { getUserProgressForPeriod, getUserLastProgress } from "@/app/lib/services/stats";

export const useProgressForPeriod= (userId: string | undefined, start: Date, end: Date) => {
  return useQuery({
    queryKey: ["progressForPeriod", { userId, start: start.toISOString(), end: end.toISOString() }],
    queryFn: () => getUserProgressForPeriod(userId!, start, end),
    staleTime: 1000 * 60 * 60 * 6, // 6 hour
    enabled: !!userId,
  });
};

export const useLastProgress= (userId: string | undefined, amount: number = 10) => {
  return useQuery({
    queryKey: ["lastProgress", { userId, amount }],
    queryFn: () => getUserLastProgress(userId!, amount),
    staleTime: 1000 * 60 * 60 * 6, // 6 hour
    enabled: !!userId,
  });
};
