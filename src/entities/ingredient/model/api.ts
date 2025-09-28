import { api } from "@/shared/api/client";
import { BaseQueryParams } from "@/shared/api/types";
import { PAGE_SIZE } from "@/shared/config/constants/api";
import { END_POINTS } from "@/shared/config/constants/api";
import { INGREDIENT_CATEGORY_CODES } from "@/shared/config/constants/recipe";
import { buildParams } from "@/shared/lib/utils";

import { IngredientQueryParams, IngredientsApiResponse } from "./types";

export const getIngredients = async ({
  category,
  q,
  pageParam = 0,
  isMine = false,
  isFridge = false,
}: {
  category: string | null;
  q?: string;
  sort?: string;
  pageParam: number;
  isMine: boolean;
  isFridge?: boolean;
}) => {
  const baseParams: Partial<BaseQueryParams> = {
    page: pageParam,
    size: PAGE_SIZE,
  };

  const optionalParams: Partial<IngredientQueryParams> = {
    category: category
      ? INGREDIENT_CATEGORY_CODES[
          category as keyof typeof INGREDIENT_CATEGORY_CODES
        ]
      : null,
    q,
  };

  const apiParams = buildParams(baseParams, optionalParams);

  const endPoint = isMine
    ? END_POINTS.MY_INGREDIENTS
    : isFridge
      ? END_POINTS.INGREDIENTS
      : END_POINTS.SEARCH_INGREDIENTS;

  console.log("endPoint", endPoint, isMine, isFridge);

  const response = await api.get<IngredientsApiResponse>(endPoint, {
    params: apiParams,
  });
  return response;
};

export const addIngredientBulk = async (ingredientIds: number[]) => {
  const response = await api.post(END_POINTS.MY_INGREDIENTS_BULK, {
    ingredientIds,
  });
  return response;
};
