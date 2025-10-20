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
} from "./types";
import { RecipePayload } from "./types";

export const getRecipe = async (id: number) => {
  const response = await api.get<Recipe>(END_POINTS.RECIPE(id));
  return response;
};

export const getRecipeItems = async (params: RecipeQueryParams) => {
  const { maxCost, period } = params;

  let endpoint = END_POINTS.RECIPE_SEARCH;
  if (maxCost !== undefined) {
    endpoint = END_POINTS.RECIPE_BUDGET;
  } else if (period !== undefined) {
    endpoint = END_POINTS.RECIPE_POPULAR;
  }

  return api.get<DetailedRecipesApiResponse>(endpoint, {
    params,
    paramsSerializer: customParamsSerializer,
  });
};

export const getMyIngredientRecipes = async (
  sort: string = "createdAt,desc"
) => {
  return fetchPagedRecipes<IngredientRecipesApiResponse>(
    END_POINTS.MY_INGREDIENT_RECIPES,
    {
      sort,
      page: 0,
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
};

export const editRecipe = async ({
  recipeId,
  recipe,
  files,
}: RecipeEditData) => {
  return api.put<PresignedUrlResponse>(END_POINTS.RECIPE(recipeId), {
    recipe,
    files,
  });
};
