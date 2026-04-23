import { getUserRoutines } from "@/app/lib/services/routines";
import { useQuery } from "@tanstack/react-query";

export const useRoutines = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["routines", userId],
    queryFn: () => getUserRoutines(userId!),
    staleTime: 1000 * 60 * 60,
    enabled: !!userId,
  });
};