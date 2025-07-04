import { END_POINTS } from "@/shared/config/constants/api";

import {
  DetailedRecipesApiResponse,
  fetchPagedRecipes,
} from "@/entities/recipe";

export const getMyRecipeItems = ({
  userId,
  sort,
  pageParam = 0,
}: {
  userId: number;
  sort: string;
  pageParam?: number;
}) => {
  return fetchPagedRecipes<DetailedRecipesApiResponse>(
    END_POINTS.USER_RECIPES(userId),
    {
      sort,
      pageParam,
    }
  );
};
