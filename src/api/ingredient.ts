import { END_POINTS, PAGE_SIZE } from '@/constants/api';
import { IngredientItem } from '@/type/recipe';
import { BaseQueryParams, PageResponse } from '@/type/query';
import { axiosInstance } from './axios';
import { buildParams } from '@/utils/object';

export type IngredientsApiResponse = PageResponse<IngredientItem>;

type IngredientQueryParams = BaseQueryParams & {
  category?: string | null;
};

export const getIngredients = async ({
  category,
  search,
  sort = 'ASC',
  pageParam = 0,
  isMine = false,
}: {
  category: string | null;
  search?: string;
  sort?: string;
  pageParam: number;
  isMine: boolean;
}) => {
  const baseParams: BaseQueryParams = {
    page: pageParam,
    size: PAGE_SIZE,
    sort: `ingredient.name,${sort}`,
  };

  const optionalParams: Partial<IngredientQueryParams> = {
    category,
    search,
  };

  const apiParams = buildParams(baseParams, optionalParams);

  const endPoint = isMine ? END_POINTS.MY_INGREDIENTS : END_POINTS.INGREDIENTS;

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
