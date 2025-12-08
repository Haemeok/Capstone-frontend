"use client";

import { useEffect } from "react";
import { ReactNode } from "react";

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

  useAuthManager();

  useMyInfoQuery(myInfo && isAuthenticated(myInfo) ? myInfo.user : undefined);

  useEffect(() => {
    if (myInfo && isAuthenticated(myInfo)) {
      queryClient.setQueryData(["myInfo"], myInfo.user);
      setUser(myInfo.user);

      setLoginState(true);
    }

    if (myInfo && isTokenExpired(myInfo)) {
      logoutAction();
      setLoginState(false);

      addToast({
        message: "로그인이 만료되었습니다. 다시 로그인해주세요.",
        variant: "error",
      });
    }
  }, [myInfo, queryClient, logoutAction, setUser, addToast]);

  return <>{children}</>;
};
