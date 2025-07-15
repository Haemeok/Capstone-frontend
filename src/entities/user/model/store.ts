import { create } from "zustand";

import { User } from "./types";

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logoutAction: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  logoutAction: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
