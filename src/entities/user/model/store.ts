import { create } from "zustand";

import { queryClient } from "@/shared/lib/queryClient";

import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/features/auth/lib/token";

import { User } from "./types";

type UserState = {
  user: User | null;
  hasToken: boolean;
  setUser: (user: User | null) => void;
  loginAction: (token: string) => void;
  logoutAction: () => void;
  initializeAuth: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  hasToken: !!getAccessToken(),

  setUser: (user) => set({ user }),

  initializeAuth: () => {
    set({ hasToken: !!getAccessToken() });
    if (!!getAccessToken()) {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  },

  loginAction: async (token) => {
    setAccessToken(token);
    try {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    } catch (error) {
      console.error("Failed to invalidate user query", error);
    }
  },

  logoutAction: () => {
    removeAccessToken();
    set({ user: null });
  },
}));
