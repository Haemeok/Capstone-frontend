"use client";

import { useEffect } from "react";
import { ReactNode } from "react";
import { useUserStore } from "@/entities/user/model/store";
import { useToastStore } from "@/widgets/Toast/model/store";
import { useMyInfoQuery } from "@/entities/user/model/hooks";
import {
  ServerAuthResult,
  isAuthenticated,
  isTokenExpired,
} from "@/shared/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AppStateInitializerProps = {
  children: ReactNode;
  myInfo?: ServerAuthResult;
};

export const AppStateInitializer = ({
  children,
  myInfo,
}: AppStateInitializerProps) => {
  const { logoutAction } = useUserStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    const handleForceLogout = () => {
      logoutAction();
      addToast({
        message: "로그인이 만료되었습니다. 다시 로그인해주세요.",
        variant: "error",
      });
    };

    if (myInfo && isTokenExpired(myInfo)) {
      handleForceLogout();
    }
    window.addEventListener("forceLogout", handleForceLogout);
    return () => window.removeEventListener("forceLogout", handleForceLogout);
  }, [myInfo, logoutAction, addToast]);

  const initialData =
    myInfo && isAuthenticated(myInfo) ? myInfo.user : undefined;
  const { user } = useMyInfoQuery(initialData);

  return <>{children}</>;
};
