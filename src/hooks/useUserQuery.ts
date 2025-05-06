import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '@/api/user';
import { useUserStore } from '@/store/useUserStore';

export const useUserQuery = () => {
  const hasToken = useUserStore((state) => state.hasToken);
  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getMyInfo,
    enabled: hasToken,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });

  return {
    user: userData,
    isLoading,
    isError,
    error,
    refetchUser: refetch,
  };
};
