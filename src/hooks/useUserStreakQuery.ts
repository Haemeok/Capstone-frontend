import { getUserStreak } from '@/api/user';
import { useQuery } from '@tanstack/react-query';

const useUserStreakQuery = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userStreak'],
    queryFn: getUserStreak,
  });

  return { data, isLoading, error };
};

export default useUserStreakQuery;
