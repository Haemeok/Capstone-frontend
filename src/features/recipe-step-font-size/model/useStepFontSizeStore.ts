import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const STEP_FONT_LEVEL_COUNT = 3;

export const STEP_FONT_CLASS = [
  "",
  "text-xl leading-relaxed",
  "text-2xl leading-relaxed",
] as const;

type StepFontSizeState = {
  level: number;
  cycle: () => void;
};

export const useStepFontSizeStore = create<StepFontSizeState>()(
  persist(
    (set) => ({
      level: 0,
      cycle: () =>
        set((state) => ({ level: (state.level + 1) % STEP_FONT_LEVEL_COUNT })),
    }),
    {
      name: "recipe-step-font-size",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
