import { END_POINTS, PAGE_SIZE } from '@/constants/api';
import { IngredientItem } from '@/type/recipe';
import { axiosInstance } from './axios';

type PageResponse<T> = {
  content: T[];

  totalElements: number;
  totalPages: number;
  last: boolean;
  number: number;

  numberOfElements: number;
  first: boolean;
  empty: boolean;
  size: number;

  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
};

export type IngredientsApiResponse = PageResponse<IngredientItem>;

type QueryParams = {
  page: number;
  size: number;
  sort: string;
  category?: string | null;
  search?: string;
};

export const getIngredients = async ({
  category,
  search,
  sort,
  pageParam = 0,
  isMine = false,
}: {
  category: string | null;
  search?: string;
  sort: string;
  pageParam: number;
  isMine: boolean;
}) => {
  const apiParams: QueryParams = {
    page: pageParam,
    size: PAGE_SIZE,
    sort: sort === 'asc' ? 'name,asc' : 'name,desc',
  };

  if (category) {
    apiParams.category = category;
  }

  if (search) {
    apiParams.search = search;
  }

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
    END_POINTS.INGREDIENTS_BY_ID(id),
    {
      useAuth: true,
    },
  );
  return response.data;
};
