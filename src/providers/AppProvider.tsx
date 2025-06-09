import React, { useEffect } from 'react';
import { useMyInfoQuery } from '@/hooks/useUserQuery';
import { useUserStore } from '@/store/useUserStore';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ForceLogoutEventDetail } from '@/api/interceptors';
import { useToastStore } from '@/store/useToastStore';

type AppProviderProps = {
  children: React.ReactNode;
};

gsap.registerPlugin(ScrollTrigger);

const AppProvider = ({ children }: AppProviderProps) => {
  const { user, isLoading, isError } = useMyInfoQuery();
  const { setUser, initializeAuth, logoutAction } = useUserStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
    console.log('App Initialization Complete. User:', user);
  }, [user, setUser]);

  useEffect(() => {
    const handleForceLogout = () => {
      logoutAction();
      addToast({
        message: '로그인이 만료되었습니다. 다시 로그인해주세요.',
        variant: 'error',
        position: 'bottom',
        size: 'medium',
      });
    };

    window.addEventListener('forceLogout', handleForceLogout);

    return () => {
      window.removeEventListener('forceLogout', handleForceLogout);
    };
  }, [logoutAction, addToast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AppProvider;
