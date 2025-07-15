"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getMyInfo, getRecipeHistoryDetail, getUserInfo } from "./api";
import { useUserStore } from "./store";
import { setUserContext } from "@/shared/lib/errorTracking";
import { User } from "./types";

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

export const useMyInfoQuery = (initialData?: User) => {
  const setUser = useUserStore((state) => state.setUser);
  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getMyInfo,
    staleTime: 10 * 60 * 1000,
    retry: false,
    initialData,
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
      // Sentry 사용자 컨텍스트 설정
      setUserContext({
        id: userData.id.toString(),
        email: userData.email,
      });
    } else if (isError) {
      setUser(null);
    }
  }, [userData, isError, setUser]);

  return {
    user: userData,
    isLoading,
    isError,
    error,
    refetchUser: refetch,
  };
};
