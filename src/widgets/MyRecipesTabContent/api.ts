import { END_POINTS, PAGE_SIZE } from "@/shared/config/constants/api";

import {
  DetailedRecipesApiResponse,
  fetchPagedRecipes,
} from "@/entities/recipe";

export const getMyRecipeItems = ({
  userId,
  sort,
  pageParam = 0,
}: {
  userId: string;
  sort: string;
  pageParam?: number;
}) => {
  return fetchPagedRecipes<DetailedRecipesApiResponse>(
    END_POINTS.USER_RECIPES(userId),
    {
      sort,
      page: pageParam,
      size: PAGE_SIZE,
    }
  );
};
