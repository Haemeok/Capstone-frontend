import { create } from "zustand";

import type { CurationParams } from "@/entities/curation";

type State = {
  selected: CurationParams | null;
  selectedSlug: string | null;
  setSelected: (p: CurationParams | null, slug?: string | null) => void;
};

export const useCurationStore = create<State>((set) => ({
  selected: null,
  selectedSlug: null,
  setSelected: (selected, slug = null) =>
    set({ selected, selectedSlug: selected ? slug : null }),
}));
