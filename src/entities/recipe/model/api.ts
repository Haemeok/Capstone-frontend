import { api } from "@/shared/api/client";
import { BaseQueryParams } from "@/shared/api/types";
import { PresignedUrlResponse } from "@/shared/api/types";
import {
  BASE_API_URL,
  END_POINTS,
  PAGE_SIZE,
} from "@/shared/config/constants/api";
import { buildParams, customParamsSerializer } from "@/shared/lib/utils";
import { FileInfoRequest } from "@/shared/types";

import {
  BaseRecipesApiResponse,
  DetailedRecipesApiResponse,
  IngredientRecipesApiResponse,
  Recipe,
  RecipeItemsQueryParams,
  RecipeQueryParams,
} from "./types";
import { RecipePayload } from "./types";

export const getRecipe = async (id: number) => {
  const response = await api.get<Recipe>(END_POINTS.RECIPE(id));
  return response;
};

export const getRecipeItems = async ({
  sort,
  dishType,
  tagNames,
  q,
  isAiGenerated,
  size = PAGE_SIZE,
  pageParam = 0,
}: {
  sort: string;
  dishType?: string | null;
  tagNames?: string[] | null;
  q?: string;
  isAiGenerated?: boolean;
  size?: number;
  pageParam?: number;
}) => {
  const baseParams: BaseQueryParams = {
    page: pageParam,
    size,
    sort: `createdAt,${sort}`,
  };

  const optionalParams: Partial<RecipeQueryParams> = {
    dishType,
    tagNames,
    q,
    isAiGenerated,
  };

  const apiParams = buildParams(baseParams, optionalParams);

  const response = await api.get<DetailedRecipesApiResponse>(
    END_POINTS.RECIPE_SEARCH,
    {
      params: apiParams,
      paramsSerializer: customParamsSerializer,
    }
  );

  return response;
};

export const getMyIngredientRecipes = async (sort: string = "createdAt,desc") => {
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
  { sort, page = 0, size = PAGE_SIZE }: BaseQueryParams
) => {
  const apiParams: BaseQueryParams = {
    page,
    size,
    sort: `createdAt,${sort}`,
  };

  const response = await api.get<T>(endpoint, {
    params: apiParams,
  });

  return response;
};

export const postRecipe = async ({
  recipe,
  files,
}: {
  recipe: RecipePayload;
  files: FileInfoRequest[];
}) => {
  const response = await api.post<PresignedUrlResponse>(END_POINTS.RECIPES, {
    recipe,
    files,
  });
  return response;
};

export const editRecipe = async ({
  recipeId,
  recipe,
  files,
}: {
  recipeId: number;
  recipe: RecipePayload;
  files: FileInfoRequest[];
}) => {
  console.log("Recipe", recipe);
  console.log("Files", files);
  const response = await api.put<PresignedUrlResponse>(
    END_POINTS.RECIPE(recipeId),
    {
      recipe,
      files,
    }
  );
  console.log(response);
  return response;
};
