"use client";

import { useEffect } from "react";
import { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  isAuthenticated,
  isTokenExpired,
  isUnauthenticated,
  ServerAuthResult,
} from "@/shared/types";

import { useAuthManager } from "@/shared/lib/auth/useAuthManager";
import { useUserStore } from "@/entities/user/model/store";
import { useMyInfoQuery } from "@/entities/user/model/hooks";

gsap.registerPlugin(ScrollTrigger);

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
