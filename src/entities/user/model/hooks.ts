"use client";

import { useEffect, useRef } from "react";

import { useQuery } from "@tanstack/react-query";

import { notifyAuthState } from "@/shared/lib/bridge/authStateBridge";

import { getMyInfo, getUserInfo } from "./api";
import { useUserStore } from "./store";

export const useUserQuery = (userId: string, isOtherProfile: boolean) => {
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
    enabled: isOtherProfile && userId !== undefined,
  });

  return {
    user: userData,
    isLoading,
    isError,
    error,
    refetchUser: refetch,
  };
};

export const useMyInfoQuery = () => {
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
  });

  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (userData) {
      setUser(userData);
      // user transition (null → user 또는 다른 user)에만 발화.
      // useMyInfoQuery는 여러 consumer에서 호출되므로 가드 없으면 페이지 진입마다
      // consumer 수만큼 중복 fire되어 PHASE 2 telemetry 노이즈가 큼.
      if (lastUserIdRef.current !== userData.id) {
        notifyAuthState("login");
        lastUserIdRef.current = userData.id;
      }
    } else if (isError) {
      setUser(null);
      lastUserIdRef.current = null;
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
