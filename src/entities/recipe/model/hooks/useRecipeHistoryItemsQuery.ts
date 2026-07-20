import { useQuery } from "@tanstack/react-query";

import { useUserPagesLocale } from "@/shared/i18n";

import { getRecipeHistoryItems } from "../api";

export const useRecipeHistoryItemsQuery = (date: string, enabled: boolean) => {
  const locale = useUserPagesLocale();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipeHistoryItems", date, locale],
    queryFn: () => getRecipeHistoryItems(date, locale),
    enabled,
  });

  return { data, isLoading, error };
};
