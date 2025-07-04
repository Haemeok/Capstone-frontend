import { BaseQueryParams } from "@/shared/api/types";
import { PAGE_SIZE } from "@/shared/config/constants/api";
import { INGREDIENT_CATEGORY_CODES } from "@/shared/config/constants/recipe";
import { END_POINTS } from "@/shared/config/constants/api";
import { axiosInstance } from "@/shared/api/axios";
import { buildParams } from "@/shared/lib/utils";
import { IngredientsApiResponse, IngredientQueryParams } from "./types";

export const getIngredients = async ({
  category,
  q,
  sort = "ASC",
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

  const response = await axiosInstance.get<IngredientsApiResponse>(endPoint, {
    params: apiParams,
    useAuth: true,
  });
  return response.data;
};
