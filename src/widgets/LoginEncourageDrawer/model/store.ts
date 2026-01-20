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
    openDrawer: (options) => set({ isOpen: true, ...options }),
    closeDrawer: () =>
      set({ isOpen: false, icon: undefined, message: undefined }),
  })
);
