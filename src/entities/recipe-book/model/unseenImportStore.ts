import { create } from "zustand";

import { storage } from "@/shared/lib/storage";

export const UNSEEN_IMPORT_STORAGE_KEY = "recipio-recipe-book-unseen-import";

type UnseenImportStore = {
  hasUnseenImport: boolean;
  markUnseen: () => void;
  clearUnseen: () => void;
};

const readInitial = (): boolean =>
  storage.getBooleanItem(UNSEEN_IMPORT_STORAGE_KEY);

export const useUnseenImportStore = create<UnseenImportStore>((set) => ({
  hasUnseenImport: readInitial(),

  markUnseen: () => {
    storage.setBooleanItem(UNSEEN_IMPORT_STORAGE_KEY, true);
    set({ hasUnseenImport: true });
  },

  clearUnseen: () => {
    storage.removeItem(UNSEEN_IMPORT_STORAGE_KEY);
    set({ hasUnseenImport: false });
  },
}));
