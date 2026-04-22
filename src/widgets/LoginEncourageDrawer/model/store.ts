import { ReactNode } from "react";

import { create } from "zustand";

type LoginEncourageDrawerStore = {
  isOpen: boolean;
  icon?: ReactNode;
  message?: string;
  openDrawer: (options?: { icon?: ReactNode; message?: string }) => void;
  closeDrawer: () => void;
};

export const useLoginEncourageDrawerStore = create<LoginEncourageDrawerStore>(
  (set) => ({
    isOpen: false,
    icon: undefined,
    message: undefined,
    openDrawer: (options) =>
      set({
        isOpen: true,
        icon: options?.icon,
        message: options?.message,
      }),
    closeDrawer: () => set({ isOpen: false }),
  })
);
