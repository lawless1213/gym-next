import { useQuery } from "@tanstack/react-query";
import { getUserRecords } from "@/lib/services/records";
import { Period } from "@/types";
import { queryKeys } from "@/lib/queryKeys";

export const useRecords = ({
  userId,
  period = "all",
  exerciseIds,
}: {
  userId: string | undefined;
  period?: Period;
  exerciseIds?: string[];
}) => {
  return useQuery({
    queryKey: queryKeys.records.list(userId, period, exerciseIds),
    queryFn: () => getUserRecords(userId!, period, exerciseIds),
    staleTime: 1000 * 60 * 60 * 6,
    enabled: !!userId,
  });
};
