import { create } from "zustand";

type AIRecipeFocusStore = {
  focusFormPage: boolean;
  setFocusFormPage: (on: boolean) => void;
};

export const useAIRecipeFocusStore = create<AIRecipeFocusStore>((set) => ({
  focusFormPage: false,
  setFocusFormPage: (on) => set({ focusFormPage: on }),
}));
