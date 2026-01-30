import { create } from "zustand";

type KeyboardState = {
  keyboardHeight: number;
  isKeyboardOpen: boolean;
  setKeyboardState: (height: number, isOpen: boolean) => void;
};

export const useKeyboardStore = create<KeyboardState>((set) => ({
  keyboardHeight: 0,
  isKeyboardOpen: false,
  setKeyboardState: (height, isOpen) =>
    set({ keyboardHeight: height, isKeyboardOpen: isOpen }),
}));
