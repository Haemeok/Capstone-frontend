import React, { useEffect } from 'react';
import { useUserQuery } from '@/hooks/useUserQuery';
import { useUserStore } from '@/store/useUserStore';

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  const { user, isLoading, isError } = useUserQuery();
  const { setUser, initializeAuth } = useUserStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log('App Initialization Complete. User:', user);
  return <>{children}</>;
};

export default AppProvider;
