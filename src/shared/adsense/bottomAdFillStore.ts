import { create } from "zustand";

type BottomAdFillState = {
  filled: boolean;
  setFilled: (filled: boolean) => void;
};

export const useBottomAdFillStore = create<BottomAdFillState>((set) => ({
  filled: false,
  setFilled: (filled) => set({ filled }),
}));
