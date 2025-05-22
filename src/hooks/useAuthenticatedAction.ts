import { useUserStore } from '@/store/useUserStore';
import { useCallback } from 'react';
import { END_POINTS } from '@/constants/api';
import { useNavigate, useLocation } from 'react-router';

const useAuthenticatedAction = <T extends any[]>(
  actionFn: (...args: T) => void,
) => {
  const { user } = useUserStore();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const location = useLocation();

  return (...args: T) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    } else {
      actionFn(...args); // 실제 액션 실행
    }
  };
};

export default useAuthenticatedAction;
