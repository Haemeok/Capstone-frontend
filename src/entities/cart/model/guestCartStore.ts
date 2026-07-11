import { create } from "zustand";

import { CART_MAX_ITEMS } from "../api/types";
import {
  clearGuestCartItems,
  loadGuestCartItems,
  saveGuestCartItems,
} from "./guestCartPersistence";

export type GuestCartItem = {
  recipeIngredientId: string;
  name: string;
  quantity: string;
  unit: string;
  recipe: { recipeId: string; title: string; imageUrl: string | null };
};

export type GuestAddResult = { addedCount: number; skippedCount: number };

type GuestCartStore = {
  items: GuestCartItem[];
  isHydrated: boolean;
  hydrateFromStorage: () => void;
  addItems: (items: GuestCartItem[]) => GuestAddResult;
  updateItem: (
    recipeIngredientId: string,
    next: { quantity: string; unit: string }
  ) => void;
  removeItems: (recipeIngredientIds: string[]) => void;
  clear: () => void;
};

export const useGuestCartStore = create<GuestCartStore>((set, get) => ({
  items: [],
  isHydrated: false,

  hydrateFromStorage: () => {
    set({ items: loadGuestCartItems(), isHydrated: true });
  },

  addItems: (newItems) => {
    const existing = new Set(get().items.map((i) => i.recipeIngredientId));
    let addedCount = 0;
    let skippedCount = 0;
    const accepted: GuestCartItem[] = [];

    newItems.forEach((item) => {
      const isDuplicate =
        existing.has(item.recipeIngredientId) ||
        accepted.some((a) => a.recipeIngredientId === item.recipeIngredientId);
      const isFull = get().items.length + accepted.length >= CART_MAX_ITEMS;
      if (isDuplicate || isFull) {
        skippedCount += 1;
        return;
      }
      accepted.push(item);
      addedCount += 1;
    });

    if (accepted.length > 0) {
      const items = [...accepted.reverse(), ...get().items];
      set({ items });
      saveGuestCartItems(items);
    }
    return { addedCount, skippedCount };
  },

  updateItem: (recipeIngredientId, next) => {
    const items = get().items.map((item) =>
      item.recipeIngredientId === recipeIngredientId
        ? {
            ...item,
            quantity: next.quantity || item.quantity,
            unit: next.unit || item.unit,
          }
        : item
    );
    set({ items });
    saveGuestCartItems(items);
  },

  removeItems: (recipeIngredientIds) => {
    const ids = new Set(recipeIngredientIds);
    const items = get().items.filter(
      (item) => !ids.has(item.recipeIngredientId)
    );
    set({ items });
    saveGuestCartItems(items);
  },

  clear: () => {
    set({ items: [] });
    clearGuestCartItems();
  },
}));
