import { useQuery } from "@tanstack/react-query";
import { getUserRecords } from "@/app/lib/services/records";
import { Period } from "@/app/types";

export const useRecords = (userId: string | undefined, period: Period = "all") => {
  return useQuery({
    queryKey: ["records", { userId, period }],
    queryFn: () => getUserRecords(userId!, period),
    staleTime: 1000 * 60 * 60 * 6,
    enabled: !!userId,
  });
};