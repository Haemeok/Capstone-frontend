import { create } from "zustand";

import type { NotificationStatus } from "@/shared/lib/bridge";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { NotificationPermissionStatus } from "./types";

const AUTO_CLOSE_DELAY_MS = 2000;

type NotificationPermissionStore = {
  // 앱에서 전달받은 권한 상태 (메모리)
  status: NotificationPermissionStatus;
  isDrawerOpen: boolean;
  hasTriggeredThisSession: boolean;
  showSuccess: boolean;

  // 앱에서 상태 받았을 때 호출
  updateStatusFromApp: (status: NotificationStatus) => void;
  setStatus: (status: NotificationPermissionStatus) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  markAsTriggered: () => void;
};

export const useNotificationPermissionStore =
  create<NotificationPermissionStore>((set, get) => ({
    status: "unknown",
    isDrawerOpen: false,
    hasTriggeredThisSession: false,
    showSuccess: false,

    updateStatusFromApp: (status) => {
      set({ status });

      // granted면 성공 화면 표시 후 자동 닫힘
      if (status === "granted" && get().isDrawerOpen) {
        triggerHaptic("Success");
        set({ showSuccess: true });

        setTimeout(() => {
          set({ isDrawerOpen: false, showSuccess: false });
        }, AUTO_CLOSE_DELAY_MS);
      } else if (status === "denied" && get().isDrawerOpen) {
        // denied면 바로 닫기
        set({ isDrawerOpen: false });
      }
    },
    setStatus: (status) => set({ status }),
    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false, showSuccess: false }),
    markAsTriggered: () => set({ hasTriggeredThisSession: true }),
  }));
