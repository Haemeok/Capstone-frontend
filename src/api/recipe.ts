import { END_POINTS, PAGE_SIZE } from '@/constants/api';
import { axiosInstance } from './axios';
import {
  Recipe,
  BaseRecipeGridItem,
  DetailedRecipeGridItem,
  RecipePayload,
} from '@/type/recipe';
import {
  FileObject,
  PresignedUrlInfo,
  PresignedUrlResponse,
  UploadResult,
} from '@/type/file';
import { FileInfoRequest } from '@/type/file';
import { BaseQueryParams, PageResponse } from '@/type/query';
import { buildParams } from '@/utils/object';

export const getRecipe = async (id: number) => {
  const response = await axiosInstance.get<Recipe>(END_POINTS.RECIPE(id), {
    useAuth: 'optional',
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
  console.log('Recipe', recipe);
  console.log('Files', files);
  const response = await axiosInstance.post<PresignedUrlResponse>(
    END_POINTS.RECIPES,
    {
      recipe,
      files,
    },
  );
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
      useAuth: false,
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

export const handleS3Upload = async (
  presignedUrlsInfo: PresignedUrlInfo[],
  fileObjects: FileObject[],
): Promise<UploadResult[]> => {
  if (presignedUrlsInfo.length !== fileObjects.length) {
    throw new Error('Pre-signed URL 개수와 파일 개수가 일치하지 않습니다.');
  }

  const uploadPromises = presignedUrlsInfo.map(
    async (uploadInfo, index): Promise<UploadResult> => {
      const fileObject = fileObjects[index]?.file;
      if (!fileObject) {
        throw new Error(
          `업로드할 파일 객체를 찾을 수 없습니다 (index: ${index})`,
        );
      }

      try {
        await uploadFileToS3(fileObject, uploadInfo);
        return {
          fileKey: uploadInfo.fileKey,
          success: true,
          originalIndex: index,
        };
      } catch (err) {
        console.error(
          `S3 업로드 실패 (파일: ${fileObject.name}, 키: ${uploadInfo.fileKey}):`,
          err,
        );
        return {
          fileKey: uploadInfo.fileKey,
          success: false,
          originalIndex: index,
          error: err,
        };
      }
    },
  );

  const uploadResults = await Promise.all(uploadPromises);

  const failedUploads = uploadResults.filter((r) => !r.success);
  if (failedUploads.length > 0) {
    console.error('S3 Uploads failed:', failedUploads);
    const firstError = failedUploads[0]?.error as Error | undefined;
    throw new Error(
      `${failedUploads.length}개의 파일 S3 업로드 실패: ${firstError?.message || '알 수 없는 오류'}`,
    );
  }

  console.log('모든 파일 S3 업로드 성공');
  return uploadResults;
};

export type BaseRecipesApiResponse = PageResponse<BaseRecipeGridItem>;
export type DetailedRecipesApiResponse = PageResponse<DetailedRecipeGridItem>;

type RecipeQueryParams = BaseQueryParams & {
  dishType?: string | null;
  tagNames?: string[] | null;
  q?: string | null;
};

export const getRecipeItems = async ({
  sort,
  dishType,
  tagNames,
  q,
  pageParam = 0,
}: {
  sort: string;
  dishType?: string | null;
  tagNames?: string[] | null;
  q?: string;
  pageParam?: number;
}) => {
  const baseParams: BaseQueryParams = {
    page: pageParam,
    size: PAGE_SIZE,
    sort: `name,${sort}`,
  };

  const optionalParams: Partial<RecipeQueryParams> = {
    dishType,
    tagNames,
    q,
  };

  const apiParams = buildParams(baseParams, optionalParams);

  const response = await axiosInstance.get<DetailedRecipesApiResponse>(
    END_POINTS.RECIPE_SEARCH,
    {
      params: apiParams,
      useAuth: 'optional',
    },
  );

  return response.data;
};

export const getMyRecipeItems = async ({
  userId,
  sort,
  pageParam = 0,
}: {
  userId: number;
  sort: string;
  pageParam?: number;
}) => {
  const apiParams: BaseQueryParams = {
    page: pageParam,
    size: PAGE_SIZE,
    sort: `createdAt,${sort}`,
  };

  const response = await axiosInstance.get<DetailedRecipesApiResponse>(
    END_POINTS.USER_RECIPES(userId),
    {
      params: apiParams,
    },
  );

  return response.data;
};

export const getMyFavoriteItems = async ({
  sort,
  pageParam = 0,
}: {
  sort: string;
  pageParam?: number;
}) => {
  const apiParams: BaseQueryParams = {
    page: pageParam,
    size: PAGE_SIZE,
    sort: `createdAt,${sort}`,
  };

  const response = await axiosInstance.get<BaseRecipesApiResponse>(
    END_POINTS.MY_FAVORITES,
    {
      params: apiParams,
    },
  );

  return response.data;
};

type FinalizeRecipeResponse = {
  recipeId: number;
  activeImages: string[];
  missingImages: string[];
};

export const finalizeRecipe = async (recipeId: number) => {
  const response = await axiosInstance.post<FinalizeRecipeResponse>(
    END_POINTS.RECIPE_FINALIZE(recipeId),
  );
  return response.data;
};

export const postMyFavoriteRecipe = async (recipeId: number) => {
  const response = await axiosInstance.post(
    END_POINTS.RECIPE_FAVORITE(recipeId),
  );
  return response.data;
};
