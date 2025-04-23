import { create } from 'zustand';
import { User } from '@/type/user';

import { removeAccessToken, setAccessToken } from '@/utils/auth';
import { queryClient } from '@/lib/queryClient';

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
  loginAction: (token: string) => void;
  logoutAction: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  loginAction: async (token) => {
    setAccessToken(token);
    try {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (error) {
      console.error('Failed to invalidate user query', error);
    }
  },

  logoutAction: () => {
    removeAccessToken();
    set({ user: null });
  },
}));
