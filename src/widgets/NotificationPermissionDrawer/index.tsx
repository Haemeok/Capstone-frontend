"use client";

import { useMemo } from "react";

import { useAppMessageListener } from "@/shared/lib/bridge";

import {
  NotificationPermissionDrawer,
  useNotificationPermissionActions,
  useNotificationPermissionStore,
} from "@/features/notification-permission";

const GlobalNotificationPermissionDrawer = () => {
  const { isDrawerOpen, closeDrawer, updateStatusFromApp } =
    useNotificationPermissionStore();
  const { handleAccept, handleDecline } = useNotificationPermissionActions();

  // 앱에서 오는 메시지 리스너
  const messageHandlers = useMemo(
    () => ({
      NOTIFICATION_STATUS: (payload: { status: "granted" | "denied" | "not_determined" }) => {
        updateStatusFromApp(payload.status);
      },
    }),
    [updateStatusFromApp]
  );

  useAppMessageListener(messageHandlers);

  return (
    <NotificationPermissionDrawer
      isOpen={isDrawerOpen}
      onOpenChange={(open) => !open && closeDrawer()}
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
};

export default GlobalNotificationPermissionDrawer;
