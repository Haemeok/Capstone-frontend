"use client";

import { useEffect } from "react";
import { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { setLoginState } from "@/shared/api/auth";
import { useAuthManager } from "@/shared/lib/auth/useAuthManager";
import {
  isAuthenticated,
  isTokenExpired,
  ServerAuthResult,
} from "@/shared/types";

import { useMyInfoQuery } from "@/entities/user/model/hooks";
import { useUserStore } from "@/entities/user/model/store";

import { useToastStore } from "@/widgets/Toast/model/store";

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
  const { addToast } = useToastStore();
  const searchParams = useSearchParams();

  useAuthManager();

  useMyInfoQuery(myInfo && isAuthenticated(myInfo) ? myInfo.user : undefined);

  useEffect(() => {
    const isFromOAuth = searchParams.get("from") === "oauth";

    if (isFromOAuth) {
      window.history.replaceState({}, "", "/");
    }

    if (myInfo && isAuthenticated(myInfo)) {
      queryClient.setQueryData(["myInfo"], myInfo.user);
      setUser(myInfo.user);

      setLoginState(true);
    }

    
    if (myInfo && isTokenExpired(myInfo)) {
      logoutAction();
      setLoginState(false);
    }
  }, [myInfo, queryClient, logoutAction, setUser, searchParams]);

  return <>{children}</>;
};
