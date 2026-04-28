import { useQuery } from "@tanstack/react-query";
import { getUserRecords } from "@/app/lib/services/records";

export const useRecords= (userId: string | undefined) => {
  return useQuery({
    queryKey: ["progress", { userId }],
    queryFn: () => getUserRecords(userId!),
    staleTime: 1000 * 60 * 60 * 6, // 6 hour
    enabled: !!userId,
  });
};
