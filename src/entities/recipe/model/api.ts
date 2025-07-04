import { axiosInstance } from "@/shared/api/axios";
import { BaseQueryParams } from "@/shared/api/types";
import { PresignedUrlResponse } from "@/shared/api/types";
import { END_POINTS, PAGE_SIZE } from "@/shared/config/constants/api";
import { buildParams, customParamsSerializer } from "@/shared/lib/utils";
import { FileInfoRequest } from "@/shared/types";

import { DetailedRecipesApiResponse, Recipe, RecipeQueryParams } from "./types";
import { RecipePayload } from "./types";

export const getRecipe = async (id: number) => {
  const response = await axiosInstance.get<Recipe>(END_POINTS.RECIPE(id), {
    useAuth: "optional",
  });
  return response.data;
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
  console.log("apiParams", apiParams);
  const response = await axiosInstance.get<DetailedRecipesApiResponse>(
    END_POINTS.RECIPE_SEARCH,
    {
      params: apiParams,
      paramsSerializer: customParamsSerializer,
      useAuth: "optional",
    }
  );

  return response.data;
};

export const fetchPagedRecipes = async <T>(
  endpoint: string,
  {
    sort,
    pageParam = 0,
    size = PAGE_SIZE,
  }: { sort: string; pageParam?: number; size?: number }
) => {
  const apiParams: BaseQueryParams = {
    page: pageParam,
    size,
    sort: `createdAt,${sort}`,
  };

  const response = await axiosInstance.get<T>(endpoint, {
    params: apiParams,
  });

  return response.data;
};

export const postRecipe = async ({
  recipe,
  files,
}: {
  recipe: RecipePayload;
  files: FileInfoRequest[];
}) => {
  console.log("Recipe", recipe);
  console.log("Files", files);
  const response = await axiosInstance.post<PresignedUrlResponse>(
    END_POINTS.RECIPES,
    {
      recipe,
      files,
    }
  );
  console.log(response.data);
  return response.data;
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
  const response = await axiosInstance.put<PresignedUrlResponse>(
    END_POINTS.RECIPE(recipeId),
    {
      recipe,
      files,
    }
  );
  console.log(response.data);
  return response.data;
};
