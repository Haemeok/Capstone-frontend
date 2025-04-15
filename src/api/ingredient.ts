import { END_POINTS } from '@/constants/api';
import { IngredientItem } from '@/type/recipe';
import { axiosInstance } from './axios';

export type IngredientsApiResponse = {
  items: IngredientItem[];
  nextPage: number | null;
  totalCount?: number;
};

export const getIngredients = async ({
  category,
  search,
  pageParam = 1,
}: {
  category: string;
  search: string;
  pageParam: number;
}) => {
  const response = await axiosInstance.get<IngredientsApiResponse>(
    END_POINTS.INGREDIENTS,
    {
      params: {
        category,
        search,
        pageParam,
      },
      useAuth: true,
    },
  );
  return response.data;
};

export const addIngredient = async (id: number) => {
  const response = await axiosInstance.post(END_POINTS.INGREDIENTS_BY_ID(id), {
    useAuth: true,
  });
  return response.data;
};

export const addIngredientBulk = async (ids: number[]) => {
  const response = await axiosInstance.post(END_POINTS.INGREDIENTS, {
    ids,
    useAuth: true,
  });
  return response.data;
};

export const deleteIngredient = async (id: number) => {
  const response = await axiosInstance.delete(
    END_POINTS.INGREDIENTS_BY_ID(id),
    {
      useAuth: true,
    },
  );
  return response.data;
};
