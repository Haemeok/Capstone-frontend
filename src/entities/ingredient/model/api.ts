import { api } from "@/shared/api/client";
import { BaseQueryParams } from "@/shared/api/types";
import { PAGE_SIZE } from "@/shared/config/constants/api";
import { END_POINTS } from "@/shared/config/constants/api";
import { INGREDIENT_CATEGORY_CODES } from "@/shared/config/constants/recipe";
import { buildParams } from "@/shared/lib/utils";

import {
  IngredientQueryParams,
  IngredientsApiResponse,
  IngredientNamesResponse,
} from "./types";

export const getIngredients = async ({
  category,
  q,
  pageParam = 0,
  isMine = false,
  isFridge = false,
  size = PAGE_SIZE,
}: {
  category: string | null;
  q?: string;
  sort?: string;
  pageParam: number;
  isMine: boolean;
  isFridge?: boolean;
  size?: number;
}) => {
  const baseParams: Partial<BaseQueryParams> = {
    page: pageParam,
    size,
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

  const response = await api.get<IngredientsApiResponse>(endPoint, {
    params: apiParams,
  });
  return response;
};

export const addIngredientBulk = async (ingredientIds: string[]) => {
  const response = await api.post(END_POINTS.MY_INGREDIENTS_BULK, {
    ingredientIds,
  });
  return response;
};

export const getMyIngredientIds = async () => {
  const response = await api.get<string[]>(END_POINTS.MY_INGREDIENTS_IDS);
  return response;
};

export const getIngredientNames = async (ids: string[]) => {
  if (ids.length === 0) return { content: [] };
  const response = await api.get<IngredientNamesResponse>(
    `/api/ingredients/names`,
    { params: { ids: ids.join(",") } }
  );
  return response;
};
