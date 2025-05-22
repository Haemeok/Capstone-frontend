import { getRecipeHistoryDetail } from '@/api/history';
import { useQuery } from '@tanstack/react-query';

type QueryOptions = {
  enabled?: boolean;
};

const useRecipeHistoryDetailQuery = (date: string, options?: QueryOptions) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipeHistoryDetail', date],
    queryFn: () => getRecipeHistoryDetail(date),
    ...options,
  });

  return { data, isLoading, error };
};

export default useRecipeHistoryDetailQuery;
