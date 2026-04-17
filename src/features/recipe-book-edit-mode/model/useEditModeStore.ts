import { create } from "zustand";

type EditModeState = {
  isEditMode: boolean;
  selectedIds: Set<string>;
  enter: () => void;
  exit: () => void;
  toggle: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clear: () => void;
};

export const useEditModeStore = create<EditModeState>((set) => ({
  isEditMode: false,
  selectedIds: new Set<string>(),
  enter: () => set({ isEditMode: true }),
  exit: () => set({ isEditMode: false, selectedIds: new Set() }),
  toggle: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clear: () => set({ selectedIds: new Set() }),
}));
