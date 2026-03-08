import { useNotificationPermissionStore } from "@/features/notification-permission/model/store";

import { useReviewGateStore } from "./store";

const REVIEW_GATE_DELAY_MS = 1000;

export const scheduleReviewGate = (): void => {
  setTimeout(() => {
    const isNotificationDrawerOpen =
      useNotificationPermissionStore.getState().isDrawerOpen;
    const isReviewDrawerOpen = useReviewGateStore.getState().isDrawerOpen;

    if (isNotificationDrawerOpen || isReviewDrawerOpen) return;

    useReviewGateStore.getState().openDrawer();
  }, REVIEW_GATE_DELAY_MS);
};
