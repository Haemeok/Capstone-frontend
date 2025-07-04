import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleS3Upload } from "@/shared/api/file";
import { PresignedUrlResponse } from "@/shared/api/types";
import { FileInfoRequest } from "@/shared/types";

import { editRecipe,postRecipe } from "@/entities/recipe/model/api";
import { RecipePayload } from "@/entities/recipe/model/types";

import { prepareRecipeData } from "../../lib/prepareRecipeData";
import { RecipeFormValues } from "../types";
import { useFinalizeRecipe } from "./useFinalizeRecipe";

type UseCreateRecipeOptions = {
  onSuccess?: (data: PresignedUrlResponse) => void;
  onError?: (error: Error) => void;
};

export const useCreateRecipeWithUpload = (recipeIdForUpdate?: number) => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const actualMutationFn = async (variables: {
    recipe: RecipePayload;
    files: FileInfoRequest[];
    recipeId?: number;
  }): Promise<PresignedUrlResponse> => {
    if (recipeIdForUpdate) {
      if (typeof variables.recipeId !== "number") {
        return Promise.reject(
          new Error("업데이트 작업에는 recipeId가 필수입니다.")
        );
      }
      return editRecipe({
        recipe: variables.recipe,
        files: variables.files,
        recipeId: variables.recipeId,
      });
    }

    const { recipeId, ...postData } = variables;
    return postRecipe(postData);
  };

  const createRecipeMutation = useMutation<
    PresignedUrlResponse,
    Error,
    { recipe: RecipePayload; files: FileInfoRequest[]; recipeId?: number }
  >({
    mutationFn: actualMutationFn,
  });

  const finalizeRecipeMutation = useFinalizeRecipe();

  const mutate = async (
    formData: RecipeFormValues,
    options?: UseCreateRecipeOptions
  ) => {
    setUploadLoading(false);
    setUploadError(null);
    createRecipeMutation.reset();

    let preparedDataResult: Awaited<ReturnType<typeof prepareRecipeData>>;
    try {
      preparedDataResult = await prepareRecipeData(formData);
    } catch (prepError: any) {
      console.error("Recipe data preparation failed:", prepError);
      options?.onError?.(prepError);
      return;
    }

    const { recipeData, filesToUploadInfo, fileObjects } = preparedDataResult;

    createRecipeMutation.mutate(
      {
        recipe: recipeData,
        files: filesToUploadInfo,
        recipeId: recipeIdForUpdate,
      },
      {
        onSuccess: async (presignedUrlResponse) => {
          setUploadLoading(true);
          setUploadError(null);
          console.log("Presigned URL Response:", presignedUrlResponse);
          console.log("File Objects to Upload:", fileObjects);
          try {
            await handleS3Upload(presignedUrlResponse.uploads, fileObjects);

            const { recipeId } = presignedUrlResponse;

            options?.onSuccess?.(presignedUrlResponse);

            finalizeRecipeMutation.mutate(recipeId);
          } catch (uploadErr: any) {
            console.error("S3 파일 업로드 중 오류 발생:", uploadErr);
            setUploadError(uploadErr);
            options?.onError?.(uploadErr);
          } finally {
            setUploadLoading(false);
          }
        },
        onError: (apiError) => {
          console.error("Recipe creation API call failed:", apiError);
          options?.onError?.(apiError);
        },
      }
    );
  };

  const isLoading = createRecipeMutation.isPending || uploadLoading;
  const isError = createRecipeMutation.isError || !!uploadError;
  const error = (createRecipeMutation.error || uploadError) as Error | null;
  const isSuccess =
    createRecipeMutation.isSuccess && !uploadLoading && !uploadError;

  return {
    mutate,
    isLoading,
    isUploading: uploadLoading,
    isSuccess,
    isError,
    error,
    data: createRecipeMutation.data,
  };
};
