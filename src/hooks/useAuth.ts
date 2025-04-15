import { useUserStore } from '@/store/useUserStore';
import { useCallback } from 'react';
import { END_POINTS } from '@/constants/api';

export const useAuth = () => {
  const user = useUserStore((state) => state.user);
  const isAuthenticated = !!user;
  const logout = useUserStore((state) => state.logoutAction);

  const loginRedirect = useCallback(() => {
    window.location.href = 'https://www.haemeok.com' + END_POINTS.GOOGLE_LOGIN;
  }, []);

  return {
    user,
    isAuthenticated,
    loginRedirect,
    logout,
  };
};
