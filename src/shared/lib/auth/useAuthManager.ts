"use client";

import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useUserStore } from "@/entities/user/model/store";

import { useToastStore } from "@/widgets/Toast/model/store";

const generateClientDiagId = (): string => {
  const rand = Math.floor(Math.random() * 0xffffffff).toString(16);
  return rand.padStart(8, "0");
};

const pingDebugCookie = (phase: string, diagId: string, source: string) => {
  const params = new URLSearchParams({ phase, diagId, source });
  fetch(`/api/auth/debug-cookie?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  }).catch(() => {
    // 진단용 엔드포인트 호출 실패는 무시 (feature flag off 시 404)
  });
};

export const useAuthManager = () => {
  const queryClient = useQueryClient();
  const { logoutAction } = useUserStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    const handleTokenRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      pingDebugCookie(
        "after-token-refresh",
        generateClientDiagId(),
        "web-token-refreshed"
      );
    };

    const handleForceLogout = (event: CustomEvent) => {
      console.log("[Auth] forceLogout-received", {
        reason: event.detail?.reason,
        message: event.detail?.message,
        timestamp: new Date().toISOString(),
      });
      logoutAction();

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
