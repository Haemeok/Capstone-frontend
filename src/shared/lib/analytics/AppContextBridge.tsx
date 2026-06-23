"use client";

import { useEffect, useMemo } from "react";

import { isAppWebView, useAppMessageListener } from "@/shared/lib/bridge";

import { setAnalyticsUserProperties } from "./setAnalyticsUserProperties";

export function AppContextBridge() {
  const handlers = useMemo(
    () => ({
      APP_CONTEXT: (
        payload: Parameters<typeof setAnalyticsUserProperties>[0]
      ) => setAnalyticsUserProperties(payload),
    }),
    []
  );

  useAppMessageListener(handlers);

  // 브라우저(비앱) 세션은 APP_CONTEXT를 받지 않으므로 여기서 is_native_app=false만 세팅.
  useEffect(() => {
    if (!isAppWebView() && typeof window.gtag === "function") {
      window.gtag("set", "user_properties", { is_native_app: false });
    }
  }, []);

  return null;
}
