import { getUserRoutines } from "@/lib/services/routines";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

export const useRoutines = (userId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.routines(userId),
    queryFn: () => getUserRoutines(userId!),
    staleTime: 1000 * 60 * 60,
    enabled: !!userId,
  });
};
