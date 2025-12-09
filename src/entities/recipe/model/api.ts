import { api } from "@/shared/api/client";
import { BaseQueryParams, PresignedUrlResponse } from "@/shared/api/types";
import { END_POINTS, PAGE_SIZE } from "@/shared/config/constants/api";
import { customParamsSerializer } from "@/shared/lib/utils";
import { FileInfoRequest } from "@/shared/types";

import {
  DetailedRecipesApiResponse,
  IngredientRecipesApiResponse,
  Recipe,
  RecipeQueryParams,
  RecipeStatus,
  RecipesStatusResponse,
} from "./types";
import { RecipePayload } from "./types";
import { RecipeHistoryResponse } from "@/entities/user/model/types";
import { RecipeHistoryDetailResponse } from "./record";

export const getRecipe = async (id: number) => {
  const response = await api.get<Recipe>(END_POINTS.RECIPE(id));
  return response;
};

export const getRecipeItems = async (params: RecipeQueryParams) => {
  const { maxCost, period, pageParam, page, size, ...restParams } = params;

  const apiParams: RecipeQueryParams = {
    page: pageParam ?? page ?? 0,
    size: size ?? PAGE_SIZE,
    ...restParams,
  };

  let endpoint = END_POINTS.RECIPE_SEARCH;
  if (maxCost !== undefined) {
    endpoint = END_POINTS.RECIPE_BUDGET;
  } else if (period !== undefined) {
    endpoint = END_POINTS.RECIPE_POPULAR;
  }

  return api.get<DetailedRecipesApiResponse>(endpoint, {
    params: apiParams,
    paramsSerializer: customParamsSerializer,
  });
};

export const getMyIngredientRecipes = async (
  sort: string = "createdAt,desc",
  pageParam: number = 0
) => {
  return fetchPagedRecipes<IngredientRecipesApiResponse>(
    END_POINTS.MY_INGREDIENT_RECIPES,
    {
      sort,
      page: pageParam,
      size: PAGE_SIZE,
    }
  );
};

export const fetchPagedRecipes = async <T>(
  endpoint: string,
  params: BaseQueryParams
) => {
  return api.get<T>(endpoint, { params });
};

type RecipeSubmitData = {
  recipe: RecipePayload;
  files: FileInfoRequest[];
};

export const postRecipe = async ({ recipe, files }: RecipeSubmitData) => {
  return api.post<PresignedUrlResponse>(END_POINTS.RECIPES, {
    recipe,
    files,
  });
};

type RecipeEditData = RecipeSubmitData & {
  recipeId: number;
  isIngredientsModified?: boolean;
};

export const editRecipe = async ({
  recipeId,
  recipe,
  files,
  isIngredientsModified,
}: RecipeEditData) => {
  return api.put<PresignedUrlResponse>(`/bff/recipes/${recipeId}`, {
    recipe: {
      ...recipe,
      isIngredientsModified,
    },
    files,
  });
};

export const getRecipeStatus = async (id: number): Promise<RecipeStatus> => {
  const response = await api.get<RecipeStatus>(`/v2/recipes/${id}/status`);
  return response;
};

export const getRecipesStatus = async (
  recipeIds: number[]
): Promise<RecipesStatusResponse> => {
  const response = await api.post<RecipesStatusResponse>(`/v2/recipes/status`, {
    recipeIds,
  });
  return response;
};

export const getRecipeHistory = async ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  const response = await api.get<RecipeHistoryResponse>(
    END_POINTS.RECIPE_HISTORY,
    {
      params: {
        year,
        month,
      },
    }
  );
  return response;
};

export const getRecipeHistoryItems = async (date: string) => {
  const response = await api.get<RecipeHistoryDetailResponse[]>(
    END_POINTS.RECIPE_HISTORY,
    {
      params: {
        date,
      },
    }
  );
  return response;
};
