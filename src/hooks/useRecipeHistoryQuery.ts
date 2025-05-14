import { getRecipeHistory } from '@/api/history';
import { useQuery } from '@tanstack/react-query';

const useRecipeHistoryQuery = ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipeHistory', year, month],
    queryFn: () => getRecipeHistory({ year, month }),
  });

  return {
    recipeHistorySummary: data?.dailySummaries,
    monthlyTotalSavings: data?.monthlyTotalSavings,
    isLoading,
    error,
  };
};

export default useRecipeHistoryQuery;
