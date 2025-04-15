import { create } from 'zustand';
import { User } from '@/type/user';

import { removeAccessToken, setAccessToken } from '@/utils/auth';

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
  loginAction: (token: string) => void;
  logoutAction: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  loginAction: (token) => {
    setAccessToken(token);
  },

  logoutAction: () => {
    removeAccessToken();
    set({ user: null });
  },
}));
