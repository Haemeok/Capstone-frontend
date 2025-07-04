import { END_POINTS } from "@/shared/config/constants/api";

import { BaseRecipesApiResponse } from "@/entities/recipe";
import { fetchPagedRecipes } from "@/entities/recipe/model/api";

export const getMyFavoriteItems = ({
  sort,
  pageParam = 0,
}: {
  sort: string;
  pageParam?: number;
}) => {
  return fetchPagedRecipes<BaseRecipesApiResponse>(END_POINTS.MY_FAVORITES, {
    sort,
    pageParam,
  });
};
