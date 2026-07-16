import { create } from "zustand";

type StepFontSizeState = {
  isLarge: boolean;
  toggle: () => void;
};

export const useStepFontSizeStore = create<StepFontSizeState>((set) => ({
  isLarge: false,
  toggle: () => set((state) => ({ isLarge: !state.isLarge })),
}));
