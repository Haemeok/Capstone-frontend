import { useQuery } from "@tanstack/react-query";

import { getRecipeHistoryDetail, getUserInfo } from "./api";

export const useUserQuery = (userId: number, isOtherProfile: boolean) => {
  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserInfo(userId),
    staleTime: 10 * 60 * 1000,
    retry: false,
    enabled: isOtherProfile,
  });

  return {
    user: userData,
    isLoading,
    isError,
    error,
    refetchUser: refetch,
  };
};

type QueryOptions = {
  enabled?: boolean;
};

export const useRecipeHistoryDetailQuery = (
  date: string,
  options?: QueryOptions
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipeHistoryDetail", date],
    queryFn: () => getRecipeHistoryDetail(date),
    ...options,
  });

  return { data, isLoading, error };
};
