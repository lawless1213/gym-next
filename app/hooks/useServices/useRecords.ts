import { useQuery } from "@tanstack/react-query";
import { getUserRecords } from "@/app/lib/services/records";
import { Period } from "@/app/types";

export const useRecords = ({
  userId,
  period = "all",
  exerciseIds
}: {
  userId: string | undefined;
  period?: Period;
  exerciseIds?: string[];
}) => {
  return useQuery({
    queryKey: ["records", { userId, period, exerciseIds }],
    queryFn: () => getUserRecords(userId!, period, exerciseIds),
    staleTime: 1000 * 60 * 60 * 6,
    enabled: !!userId,
  });
};