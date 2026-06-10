import { useQuery } from "@tanstack/react-query";
import { getUserRecords, getUserRecordsThisWeek } from "@/app/lib/services/records";

export const useRecords= (userId: string | undefined) => {
  return useQuery({
    queryKey: ["records", { userId }],
    queryFn: () => getUserRecords(userId!),
    staleTime: 1000 * 60 * 60 * 6, // 6 hour
    enabled: !!userId,
  });
};

export const useRecordsThisWeek= (userId: string | undefined) => {
  return useQuery({
    queryKey: ["recordsPerWeek", { userId }],
    queryFn: () => getUserRecordsThisWeek(userId!),
    staleTime: 1000 * 60 * 60 * 6, // 6 hour
    enabled: !!userId,
  });
};
