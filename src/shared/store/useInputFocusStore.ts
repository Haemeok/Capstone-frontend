import { create } from "zustand";

type InputFocusState = {
  isInputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
};

export const useInputFocusStore = create<InputFocusState>((set) => ({
  isInputFocused: false,
  setInputFocused: (focused) => set({ isInputFocused: focused }),
}));
