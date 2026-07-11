import { storage } from "@/shared/lib/storage";

import type { GuestCartItem } from "./guestCartStore";

export const GUEST_CART_STORAGE_KEY = "recipio-guest-cart";

export const loadGuestCartItems = (): GuestCartItem[] => {
  const raw = storage.getItem(GUEST_CART_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    storage.removeItem(GUEST_CART_STORAGE_KEY);
    return [];
  }
};

export const saveGuestCartItems = (items: GuestCartItem[]): void => {
  storage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
};

export const clearGuestCartItems = (): void => {
  storage.removeItem(GUEST_CART_STORAGE_KEY);
};
