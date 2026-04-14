import { create } from "zustand";

import { User } from "./types";

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  isAuthReady: boolean;
  setUser: (user: User | null) => void;
  logoutAction: () => void;
};

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoggingOut: false,
  isAuthReady: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isAuthReady: true,
    }),

  logoutAction: () => {
    const { isLoggingOut } = get();
    if (isLoggingOut) return;

    set({ user: null, isAuthenticated: false, isLoggingOut: false });
  },
}));
