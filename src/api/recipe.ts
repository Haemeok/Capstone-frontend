import { END_POINTS } from '@/constants/api';
import { axiosInstance } from './axios';
import {
  IngredientItem,
  Recipe,
  RecipeGridItem,
  RecipePayload,
} from '@/type/recipe';
import { PresignedUrlInfo, PresignedUrlResponse } from '@/type/file';
import { FileInfoRequest } from '@/type/file';
import { AxiosProgressEvent } from 'axios';

export const getRecipes = async () => {
  const response = await axiosInstance.get(END_POINTS.RECIPES);
  return response.data;
};

export const getRecipe = async (id: number) => {
  const response = await axiosInstance.get(END_POINTS.RECIPE(id));
  return response.data;
};

export const getRecipeItems = async () => {
  const response = await axiosInstance.get<RecipeGridItem[]>(
    END_POINTS.RECIPES_SIMPLE,
  );
  return response.data;
};

export const postRecipe = async (recipe: RecipePayload) => {
  const response = await axiosInstance.post(END_POINTS.RECIPES, recipe, {
    useAuth: false,
  });
  console.log(response.data);
  return response.data;
};

export const editRecipe = async (id: number, recipe: Recipe) => {
  const response = await axiosInstance.put(END_POINTS.RECIPE(id), recipe);
  return response.data;
};

export const deleteRecipe = async (id: number) => {
  const response = await axiosInstance.delete(END_POINTS.RECIPE(id));
  return response.data;
};

export const postRecipeLike = async (id: number) => {
  const response = await axiosInstance.post(END_POINTS.RECIPE_LIKE(id));
  return response.data;
};

export const postRecipeFavorite = async (id: number) => {
  const response = await axiosInstance.post(END_POINTS.RECIPE_FAVORITE(id));
  return response.data;
};

export const postRecipeVisibility = async (id: number) => {
  const response = await axiosInstance.post(END_POINTS.RECIPE_VISIBILITY(id));
  return response.data;
};

export const getRecipesByCategory = async (categorySlug: string) => {
  const response = await axiosInstance.get(
    END_POINTS.RECIPES_BY_CATEGORY(categorySlug),
  );
  return response.data;
};

export const postPresignedUrls = async (files: FileInfoRequest[]) => {
  console.log('Requesting Pre-signed URLs for:', files);

  const response = await axiosInstance.post<PresignedUrlResponse>(
    END_POINTS.PRESIGNED_URLS,
    {
      files,
    },
  );
  console.log('Received Pre-signed URLs:', response.data);
  return response.data;
};

export const uploadFileToS3 = async (
  file: File,
  presignedUrlInfo: PresignedUrlInfo,
  onProgress?: (fileKey: string, percent: number) => void,
) => {
  const { presignedUrl, fileKey } = presignedUrlInfo;
  console.log(`Uploading ${file.name} to S3 with key: ${fileKey}`);

  try {
    await axiosInstance.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const total = progressEvent.total ?? file.size;
        if (onProgress && total > 0) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / total,
          );
          onProgress(fileKey, percentCompleted);
        }
      },
    });

    console.log(
      `Successfully uploaded ${file.name} to S3. File key: ${fileKey}`,
    );

    if (onProgress) {
      onProgress(fileKey, 100);
    }

    return fileKey;
  } catch (error) {
    console.error(
      `Error uploading ${file.name} (key: ${fileKey}) to S3:`,
      error,
    );
    throw error;
  }
};
