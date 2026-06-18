import { api } from "@/shared/api/client";
import { BaseQueryParams, PresignedUrlResponse } from "@/shared/api/types";
import { END_POINTS, PAGE_SIZE } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";
import { FileInfoRequest } from "@/shared/types";

import { RecipeHistoryResponse } from "@/entities/user/model/types";

import { RecipeHistoryDetailResponse, RecordTimelineResponse } from "./record";
import {
  DetailedRecipesApiResponse,
  IngredientRecipesApiResponse,
  MyFridgePageResponse,
  MyFridgeRecipeItem,
  Recipe,
  RecipeQueryParams,
  RecipesStatusResponse,
  RecipeStatus,
  StaticDetailedRecipeGridItem,
  StaticDetailedRecipesApiResponse,
  TrendingYoutubeRecipe,
} from "./types";
import { RecipePayload } from "./types";

export const getRecipe = async (id: string) => {
  const response = await api.get<Recipe>(END_POINTS.RECIPE(id));
  return response;
};

export const getRecipeItems = async (params: RecipeQueryParams) => {
  const { pageParam, page, size, ...restParams } = params;

  const apiParams: RecipeQueryParams = {
    page: pageParam ?? page ?? 0,
    size: size ?? PAGE_SIZE,
    ...restParams,
  };

  const endpoint = END_POINTS.RECIPE_SEARCH;

  return api.get<DetailedRecipesApiResponse>(endpoint, {
    params: apiParams,
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

// my-fridge 전용 API (V2 - totalElements/totalPages 없는 응답)
export const getMyFridgeRecipes = async (
  sort: string = "createdAt,desc",
  pageParam: number = 0,
  lang: Locale = "ko"
): Promise<MyFridgePageResponse<MyFridgeRecipeItem>> => {
  return api.get(END_POINTS.MY_INGREDIENT_RECIPES, {
    params: {
      sort,
      page: pageParam,
      size: PAGE_SIZE,
      ...(lang === "ko" ? {} : { lang }),
    },
  });
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
  recipeId: string;
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

export const getRecipeStatus = async (id: string): Promise<RecipeStatus> => {
  const response = await api.get<RecipeStatus>(`/dev/recipes/${id}/status`);
  return response;
};

export const getRecipesStatus = async (
  recipeIds: string[]
): Promise<RecipesStatusResponse> => {
  const response = await api.post<RecipesStatusResponse>(
    `/dev/recipes/status`,
    {
      recipeIds,
    }
  );
  return response;
};

export const getTrendingYoutubeRecipes = async (): Promise<
  TrendingYoutubeRecipe[]
> => {
  const response = await api.get<TrendingYoutubeRecipe[]>(
    END_POINTS.RECIPE_YOUTUBE_RECOMMEND
  );
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

export const getRecipeHistoryItems = async (date: string, lang: Locale) => {
  const response = await api.get<RecipeHistoryDetailResponse[]>(
    END_POINTS.RECIPE_HISTORY,
    {
      params: {
        date,
        lang,
      },
    }
  );
  return response;
};

export const getRecordsTimeline = async ({
  page,
  size,
  lang,
}: {
  page: number;
  size: number;
  lang: Locale;
}) => {
  const response = await api.get<RecordTimelineResponse>(
    END_POINTS.RECORDS_TIMELINE,
    {
      params: {
        page,
        size,
        sort: "createdAt,desc",
        lang,
      },
    }
  );
  return response;
};

export type IngredientReportReason =
  | "WRONG_QUANTITY"
  | "WRONG_NAME"
  | "NOT_EXIST"
  | "MISSING"
  | "ETC";

export type IngredientReportData = {
  ingredientName: string;
  reason: IngredientReportReason;
  memo?: string;
};

export const reportIngredient = async (
  recipeId: string,
  data: IngredientReportData
) => {
  return api.post(END_POINTS.RECIPE_REPORTS(recipeId), data);
};

export const getRecommendedRecipes = async (
  recipeId: string,
  lang: Locale = "ko"
): Promise<StaticDetailedRecipeGridItem[]> => {
  return api.get<StaticDetailedRecipeGridItem[]>(
    END_POINTS.RECIPE_RECOMMENDATIONS(recipeId),
    {
      params: lang === "ko" ? {} : { lang },
    }
  );
};

export const getRemixes = async (
  recipeId: string,
  lang: Locale = "ko"
): Promise<StaticDetailedRecipeGridItem[]> => {
  const page = await api.get<StaticDetailedRecipesApiResponse>(
    END_POINTS.RECIPE_REMIXES(recipeId),
    {
      params: lang === "ko" ? {} : { lang },
    }
  );
  return page.content;
};
