import { axiosInstance } from "@/shared/api/axios";
import { BaseQueryParams } from "@/shared/api/types";
import { PresignedUrlResponse } from "@/shared/api/types";
import { END_POINTS, PAGE_SIZE } from "@/shared/config/constants/api";
import { FileInfoRequest } from "@/shared/types";

import { Recipe } from "./types";
import { RecipePayload } from "./types";

export const getRecipe = async (id: number) => {
  const response = await axiosInstance.get<Recipe>(END_POINTS.RECIPE(id), {
    useAuth: "optional",
  });
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
