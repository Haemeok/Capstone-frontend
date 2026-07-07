"use client";

import { useEffect, useMemo, useState } from "react";

import {
  type AppContextPayload,
  isAppWebView,
  useAppMessageListener,
} from "@/shared/lib/bridge";

import { usePostHogClient } from "./PostHogProvider";

export function PostHogAppContext() {
  const posthog = usePostHogClient();
  const [appContext, setAppContext] = useState<AppContextPayload | null>(null);

  const handlers = useMemo(
    () => ({
      APP_CONTEXT: (payload: AppContextPayload) => setAppContext(payload),
    }),
    []
  );
  useAppMessageListener(handlers);

  useEffect(() => {
    if (!posthog) return;

    if (appContext) {
      posthog.register({
        is_native_app: true,
        app_platform: appContext.platform,
        app_version: appContext.appVersion,
        os_version: appContext.osVersion,
        device_model: appContext.deviceModel,
        push_permission: appContext.pushPermission,
        app_locale: appContext.locale,
      });
      return;
    }

    // 앱 웹뷰지만 아직 APP_CONTEXT 미도착이면 태깅 보류(false로 오분류 방지).
    if (!isAppWebView()) {
      posthog.register({ is_native_app: false });
    }
  }, [posthog, appContext]);

  return null;
}
