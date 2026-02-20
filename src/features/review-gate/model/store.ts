import { create } from "zustand";

type ReviewGateStore = {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export const useReviewGateStore = create<ReviewGateStore>((set) => ({
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}));
