import { useQuery } from "@tanstack/react-query";

import { getRecipeHistory } from "@/entities/recipe/model/api";
import { useAuthGate } from "@/entities/user";
import { getUserStreak } from "@/entities/user/model/api";

export const useUserStreakQuery = () => {
  const authGate = useAuthGate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["userStreak"],
    queryFn: getUserStreak,
    enabled: authGate,
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
  const authGate = useAuthGate();
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["recipeHistory", year, month],
    queryFn: () => getRecipeHistory({ year, month }),
    enabled: authGate,
  });

  return {
    recipeHistorySummary: data?.dailySummaries,
    monthlyTotalSavings: data?.monthlyTotalSavings,
    isLoading,
    isPending,
    error,
  };
};
