import { useQuery } from "@tanstack/react-query";
import { getUserExercises, getCommonExercises } from "@/lib/services/exercises";
import { queryKeys } from "@/lib/queryKeys";

export const useCommonExercises = () => {
  return useQuery({
    queryKey: queryKeys.commonExercises(),
    queryFn: () => getCommonExercises(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hour
  });
};

export const useUserExercises = (userId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.userExercises(userId),
    queryFn: () => getUserExercises(userId!),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!userId,
  });
};

export const useAllExercises = (userId: string | undefined) => {
  const common = useCommonExercises();
  const user = useUserExercises(userId);

  return {
    data: [...(common.data ?? []), ...(user.data ?? [])],
    isLoading: common.isLoading || user.isLoading,
    isError: common.isError || user.isError,
  };
};
