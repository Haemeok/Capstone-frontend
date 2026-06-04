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
    retry: (failureCount, error) => {
      // query error is unknown; read optional HTTP status off it
      if ((error as { status?: number })?.status === 401) {
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
