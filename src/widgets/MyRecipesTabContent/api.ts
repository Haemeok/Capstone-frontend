import { END_POINTS, PAGE_SIZE } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";

import { fetchPagedRecipes, MyRecipesPageResponse } from "@/entities/recipe";

export const getMyRecipeItems = ({
  userId,
  sort,
  lang,
  pageParam = 0,
}: {
  userId: string;
  sort: string;
  lang: Locale;
  pageParam?: number;
}) => {
  return fetchPagedRecipes<MyRecipesPageResponse>(
    END_POINTS.USER_RECIPES(userId),
    {
      sort,
      page: pageParam,
      size: PAGE_SIZE,
      lang,
    }
  );
};
