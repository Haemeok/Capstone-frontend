import { api } from "@/shared/api/client";
import { BaseQueryParams } from "@/shared/api/types";
import { PresignedUrlResponse } from "@/shared/api/types";
import { END_POINTS, PAGE_SIZE } from "@/shared/config/constants/api";
import { buildParams, customParamsSerializer } from "@/shared/lib/utils";
import { FileInfoRequest } from "@/shared/types";

import {
  BaseRecipesApiResponse,
  DetailedRecipesApiResponse,
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

export const getRecipesOnServer = async (
  params: RecipeItemsQueryParams
): Promise<DetailedRecipesApiResponse> => {
  const query = new URLSearchParams({
    page: "0",
    size: "10",
    sort: `createdAt,${params.sort || "desc"}`,
  });

  if (params.q) query.append("q", params.q);
  if (params.isAiGenerated) query.append("isAiGenerated", "true");
  if (params.dishType) query.append("dishType", params.dishType);
  if (params.tagNames) {
    params.tagNames.forEach((tag) => query.append("tagNames", tag));
  }

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/recipes/search?${query.toString()}`;

  try {
    const res = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      // API 에러 처리
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`[getRecipesOnServer] Failed to fetch recipes:`, error);

    return {
      content: [],
      page: {
        size: 0,
        number: 0,
        totalElements: 0,
        totalPages: 0,
      },
    };
  }
};

export const getRecipeOnServer = async (id: number): Promise<Recipe | null> => {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`;
  if (isNaN(id) || id <= 0) {
    return null;
  }
  try {
    const res = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`[getRecipeOnServer] Failed to fetch recipe ${id}:`, error);
    return null;
  }
};
