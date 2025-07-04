import { useQuery } from "@tanstack/react-query";

import { getRecipeHistory, getUserStreak } from "@/entities/user/model/api";

export const useUserStreakQuery = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userStreak"],
    queryFn: getUserStreak,
  });

  return { data, isLoading, error };
};

export const useRecipeHistoryQuery = ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipeHistory", year, month],
    queryFn: () => getRecipeHistory({ year, month }),
  });

  return {
    recipeHistorySummary: data?.dailySummaries,
    monthlyTotalSavings: data?.monthlyTotalSavings,
    isLoading,
    error,
  };
};
