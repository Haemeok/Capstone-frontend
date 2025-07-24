"use client";

import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { setUserContext } from "@/shared/lib/errorTracking";

import { getMyInfo, getRecipeHistoryDetail, getUserInfo } from "./api";
import { useUserStore } from "./store";
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
  const [isMounted, setIsMounted] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        return false;
      }

      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    initialData,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (userData) {
      setUser(userData);

      setUserContext({
        id: userData.id.toString(),
        email: userData.email,
      });
    } else if (isError) {
      setUser(null);
    }
  }, [userData, isError, setUser, isMounted]);

  return {
    user: userData,
    isLoading,
    isError,
    error,
    refetchUser: refetch,
  };
};
