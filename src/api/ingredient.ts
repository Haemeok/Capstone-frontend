import { END_POINTS, PAGE_SIZE } from '@/constants/api';
import { IngredientItem } from '@/type/recipe';
import { BaseQueryParams, PageResponse } from '@/type/query';
import { axiosInstance } from './axios';
import { buildParams } from '@/utils/object';
import { INGREDIENT_CATEGORY_CODES } from '@/constants/recipe';

export type IngredientsApiResponse = PageResponse<IngredientItem>;

type IngredientQueryParams = BaseQueryParams & {
  category?: string | null;
};

export const getIngredients = async ({
  category,
  q,
  sort = 'ASC',
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

export const addIngredient = async (ingredientId: number) => {
  const response = await axiosInstance.post(END_POINTS.MY_INGREDIENTS, {
    ingredientId,
    useAuth: true,
  });
  return response.data;
};

export const addIngredientBulk = async (ingredientIds: number[]) => {
  const response = await axiosInstance.post(END_POINTS.MY_INGREDIENTS_BULK, {
    ingredientIds,
    useAuth: true,
  });
  return response.data;
};

export const deleteIngredient = async (id: number) => {
  const response = await axiosInstance.delete(
    END_POINTS.MY_INGREDIENTS_BY_ID(id),
    {
      useAuth: true,
    },
  );
  return response.data;
};

export const deleteIngredientBulk = async (ingredientIds: number[]) => {
  const response = await axiosInstance.delete(END_POINTS.MY_INGREDIENTS_BULK, {
    data: {
      ingredientIds,
    },
    useAuth: true,
  });
  return response.data;
};
