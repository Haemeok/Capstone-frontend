import { create } from "zustand";

type State = {
  selected: Record<string, string | number> | null;
  setSelected: (p: Record<string, string | number> | null) => void;
};

export const useCurationStore = create<State>((set) => ({
  selected: null,
  setSelected: (selected) => set({ selected }),
}));
