import { END_POINTS } from '@/constants/api';
import { axiosInstance } from './axios';
import { RecipeDailySummary, RecipeHistoryItem } from '@/type/recipe';

type RecipeHistoryResponse = {
  dailySummaries: RecipeDailySummary[];
  monthlyTotalSavings: number;
};

type RecipeHistoryDetailResponse = {
  savings: number;
  recipeId: number;
  recipeTitle: string;
  imageUrl: string;
};

export const getRecipeHistory = async ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  const response = await axiosInstance.get<RecipeHistoryResponse>(
    END_POINTS.RECIPE_HISTORY,
    {
      params: {
        year,
        month,
      },
    },
  );
  return response.data;
};

export const getRecipeHistoryDetail = async (date: string) => {
  const response = await axiosInstance.get<RecipeHistoryDetailResponse[]>(
    END_POINTS.RECIPE_HISTORY,
    {
      params: {
        date,
      },
    },
  );
  return response.data;
};
