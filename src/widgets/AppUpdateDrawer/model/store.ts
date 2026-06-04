import { create } from "zustand";

import { APP_UPDATE_DISMISS_KEY, APP_UPDATE_DISMISS_VALUE } from "./constants";

type AppUpdateDrawerStore = {
  isOpen: boolean;
  openDrawer: () => void;
  dismiss: () => void;
};

export const useAppUpdateDrawerStore = create<AppUpdateDrawerStore>((set) => ({
  isOpen: false,
  openDrawer: () => set({ isOpen: true }),
  dismiss: () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        APP_UPDATE_DISMISS_KEY,
        APP_UPDATE_DISMISS_VALUE
      );
    }
    set({ isOpen: false });
  },
}));
