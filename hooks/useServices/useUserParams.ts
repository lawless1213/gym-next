// hooks/useServices/useUserParams.ts
import { useQuery } from "@tanstack/react-query";
import { getUserParams } from "@/lib/services/user";
import { useAuth } from "@/hooks/useAuth";
import { queryKeys } from "@/lib/queryKeys";

export function useUserParams() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.userParams(user?.uid),
    queryFn: () => getUserParams(user!.uid),
    enabled: Boolean(user?.uid),
  });
}
