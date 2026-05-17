import { useQuery } from "@tanstack/react-query";

import { getRecipeHistoryItems } from "../api";

export const useRecipeHistoryItemsQuery = (date: string, enabled?: boolean) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipeHistoryItems", date],
    queryFn: () => getRecipeHistoryItems(date),
    enabled,
  });

  return { data, isLoading, error };
};
