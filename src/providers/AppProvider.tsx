import React, { useEffect } from 'react';
import { useMyInfoQuery } from '@/hooks/useUserQuery';
import { useUserStore } from '@/store/useUserStore';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type AppProviderProps = {
  children: React.ReactNode;
};

gsap.registerPlugin(ScrollTrigger);

const AppProvider = ({ children }: AppProviderProps) => {
  const { user, isLoading, isError } = useMyInfoQuery();
  const { setUser, initializeAuth } = useUserStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
    console.log('App Initialization Complete. User:', user);
  }, [user, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AppProvider;
