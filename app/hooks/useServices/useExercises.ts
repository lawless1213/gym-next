import { useQuery } from "@tanstack/react-query";
import { getUserExercises } from "@/app/lib/services/exercises";

export const useExercises = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["exercises", userId],
    queryFn: () => getUserExercises(userId!),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!userId,
  });
};