"use client";

import { useEffect } from "react";
import { ReactNode } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useAuthManager } from "@/shared/lib/auth/useAuthManager";
import {
  isAuthenticated,
  isTokenExpired,
  ServerAuthResult,
} from "@/shared/types";

import { useMyInfoQuery } from "@/entities/user/model/hooks";
import { useUserStore } from "@/entities/user/model/store";

type AppStateInitializerProps = {
  children: ReactNode;
  myInfo?: ServerAuthResult;
};

export const AppStateInitializer = ({
  children,
  myInfo,
}: AppStateInitializerProps) => {
  const queryClient = useQueryClient();
  const { logoutAction, setUser } = useUserStore();

  useAuthManager();

  useMyInfoQuery(myInfo && isAuthenticated(myInfo) ? myInfo.user : undefined);

  useEffect(() => {
    if (myInfo && isAuthenticated(myInfo)) {
      queryClient.setQueryData(["myInfo"], myInfo.user);
      setUser(myInfo.user);
    }

    if (myInfo && isTokenExpired(myInfo)) {
      logoutAction();
    }
  }, [myInfo, queryClient, logoutAction, setUser]);

  return <>{children}</>;
};
