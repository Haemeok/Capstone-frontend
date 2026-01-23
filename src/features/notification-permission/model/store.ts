import { create } from "zustand";

import type { NotificationStatus } from "@/shared/lib/bridge";

import type { NotificationPermissionStatus } from "./types";

type NotificationPermissionStore = {
  // 앱에서 전달받은 권한 상태 (메모리)
  status: NotificationPermissionStatus;
  isDrawerOpen: boolean;
  hasTriggeredThisSession: boolean;

  // 앱에서 상태 받았을 때 호출
  updateStatusFromApp: (status: NotificationStatus) => void;
  setStatus: (status: NotificationPermissionStatus) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  markAsTriggered: () => void;
};

export const useNotificationPermissionStore =
  create<NotificationPermissionStore>((set) => ({
    status: "unknown",
    isDrawerOpen: false,
    hasTriggeredThisSession: false,

    updateStatusFromApp: (status) => set({ status }),
    setStatus: (status) => set({ status }),
    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),
    markAsTriggered: () => set({ hasTriggeredThisSession: true }),
  }));
