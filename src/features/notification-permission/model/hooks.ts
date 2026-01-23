"use client";

import { useCallback } from "react";

import {
  isAppWebView,
  requestNotificationPermission,
} from "@/shared/lib/bridge";
import { storage } from "@/shared/lib/storage";

import { DISMISS_DURATION_MS, NOTIFICATION_STORAGE_KEYS } from "./constants";
import { useNotificationPermissionStore } from "./store";
import type { TriggerAction } from "./types";

export const useNotificationPermissionTrigger = () => {
  const { status, hasTriggeredThisSession, openDrawer, markAsTriggered } =
    useNotificationPermissionStore();

  const checkAndTrigger = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_action: TriggerAction): boolean => {
      // WebView 아님 → 패스
      if (!isAppWebView()) {
        return true;
      }

      // 이미 이번 세션에서 Drawer 표시함 → 패스
      if (hasTriggeredThisSession) {
        return true;
      }

      // 앱에서 granted로 왔음 → 패스
      if (status === "granted") {
        return true;
      }

      // 30일 숨김 기간 내 (localStorage) → 패스
      const isDismissed = storage.getItemWithExpiry<boolean>(
        NOTIFICATION_STORAGE_KEYS.DISMISSED
      );
      if (isDismissed) {
        return true;
      }

      // 아직 앱에서 상태 안 옴 (unknown) → 패스 (앱이 먼저 보내야 함)
      if (status === "unknown") {
        return true;
      }

      // not_determined 또는 denied → Drawer 표시
      openDrawer();
      markAsTriggered();
      return false;
    },
    [status, hasTriggeredThisSession, openDrawer, markAsTriggered]
  );

  return { checkAndTrigger };
};

export const useNotificationPermissionActions = () => {
  const { setStatus, closeDrawer } = useNotificationPermissionStore();

  const handleAccept = useCallback(() => {
    // 앱으로 권한 요청 메시지 전송
    requestNotificationPermission();
    // 앱이 실제 권한 요청 후 결과를 다시 보내주면 그때 status 업데이트됨
    closeDrawer();
  }, [closeDrawer]);

  const handleDecline = useCallback(() => {
    // 30일 숨김 처리 (localStorage)
    storage.setItemWithExpiry(
      NOTIFICATION_STORAGE_KEYS.DISMISSED,
      true,
      DISMISS_DURATION_MS
    );
    setStatus("denied");
    closeDrawer();
  }, [setStatus, closeDrawer]);

  return { handleAccept, handleDecline };
};
