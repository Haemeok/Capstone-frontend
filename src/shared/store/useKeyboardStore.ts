import { create } from "zustand";

export type KeyboardSource = "bridge" | "viewport" | "none";

type KeyboardState = {
  keyboardHeight: number;
  isKeyboardOpen: boolean;
  source: KeyboardSource;
  setKeyboardState: (
    height: number,
    isOpen: boolean,
    source: KeyboardSource
  ) => void;
};

export const useKeyboardStore = create<KeyboardState>((set) => ({
  keyboardHeight: 0,
  isKeyboardOpen: false,
  source: "none",
  setKeyboardState: (height, isOpen, source) =>
    set({ keyboardHeight: height, isKeyboardOpen: isOpen, source }),
}));
