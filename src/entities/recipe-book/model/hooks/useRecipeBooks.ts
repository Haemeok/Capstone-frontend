import { useQuery } from "@tanstack/react-query";

import { useUserPagesLocale } from "@/shared/i18n";

import { getRecipeBooks } from "@/entities/recipe-book/api";

import { RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

export const useRecipeBooks = () => {
  const locale = useUserPagesLocale();

  return useQuery({
    queryKey: RECIPE_BOOK_QUERY_KEYS.list(locale),
    queryFn: () => getRecipeBooks(locale),
  });
};
