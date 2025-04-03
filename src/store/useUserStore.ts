import { User } from "@/type/user";
import { create } from "zustand";

type AuthState = {
  isLogged: boolean;
  user: User | null;
  accessToken: string | null;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  logIn: () => void;
  logOut: () => void;
  clearUser: () => void;
  clearAccessToken: () => void;
};

export const useUserStore = create<AuthState>((set) => ({
  isLogged: false,
  user: null,
  accessToken: null,
  setUser: (user: User) => {
    set((state) => ({ ...state, user }));
  },
  setAccessToken: (token: string) => {
    set((state) => ({ ...state, accessToken: token }));
  },
  logIn: () => {
    set(() => ({ isLogged: true }));
  },
  logOut: () => {
    set(() => ({ isLogged: false, user: null, accessToken: null }));
  },
  clearUser: () => {
    set(() => ({ user: null }));
  },
  clearAccessToken: () => {
    set(() => ({ accessToken: null }));
  },
}));

export const getAccessToken = (): string | null => {
  return useUserStore.getState().accessToken;
};

export const setAccessToken = (token: string): void => {
  useUserStore.getState().setAccessToken(token);
  useUserStore.getState().logIn();
};

export const removeAccessToken = (): void => {
  useUserStore.getState().clearAccessToken();
  useUserStore.getState().logOut();
};
