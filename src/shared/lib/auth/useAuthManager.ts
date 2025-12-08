"use client";

import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/entities/user/model/store";

import { setLoginState } from "@/shared/api/auth";

import { useToastStore } from "@/widgets/Toast/model/store";

export const useAuthManager = () => {
  const queryClient = useQueryClient();
  const { logoutAction } = useUserStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    const handleTokenRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    };

    const handleForceLogout = (event: CustomEvent) => {
      logoutAction();

      setLoginState(false);

      const message =
        event.detail?.message ||
        "로그인이 만료되었습니다. 다시 로그인해주세요.";

      addToast({
        message,
        variant: "error",
      });
    };

    window.addEventListener("tokenRefreshed", handleTokenRefresh);
    window.addEventListener("forceLogout", handleForceLogout);

    return () => {
      window.removeEventListener("tokenRefreshed", handleTokenRefresh);
      window.removeEventListener("forceLogout", handleForceLogout);
    };
  }, [queryClient, logoutAction, addToast]);
};
