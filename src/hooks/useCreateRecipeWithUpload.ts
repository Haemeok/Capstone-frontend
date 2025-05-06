import { useState, useCallback } from 'react';
import { RecipeFormValues, RecipePayload } from '@/type/recipe';
import { FileInfoRequest, PresignedUrlResponse } from '@/type/file';
import { postRecipe, handleS3Upload } from '@/api/recipe';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prepareRecipeData } from '@/utils/recipe';
import { useFinalizeRecipe } from './useFinalizeRecipe';

interface UseCreateRecipeOptions {
  onSuccess?: (data: PresignedUrlResponse) => void;
  onError?: (error: Error) => void;
}

export const useCreateRecipeWithUpload = () => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const createRecipeMutation = useMutation<
    PresignedUrlResponse,
    Error,
    { recipe: RecipePayload; files: FileInfoRequest[] }
  >({
    mutationFn: postRecipe,
  });

  const finalizeRecipeMutation = useFinalizeRecipe();

  const mutate = async (
    formData: RecipeFormValues,
    options?: UseCreateRecipeOptions,
  ) => {
    setUploadLoading(false);
    setUploadError(null);
    createRecipeMutation.reset();

    let preparedData: ReturnType<typeof prepareRecipeData>;
    try {
      preparedData = prepareRecipeData(formData);
    } catch (prepError: any) {
      console.error('Recipe data preparation failed:', prepError);
      options?.onError?.(prepError);
      return;
    }

    const { recipeData, filesToUploadInfo, fileObjects } = preparedData;

    createRecipeMutation.mutate(
      { recipe: recipeData, files: filesToUploadInfo },
      {
        onSuccess: async (presignedUrlResponse) => {
          setUploadLoading(true);
          setUploadError(null);
          console.log('Presigned URL Response:', presignedUrlResponse);
          console.log('File Objects to Upload:', fileObjects);
          try {
            await handleS3Upload(presignedUrlResponse.uploads, fileObjects);

            const { recipeId } = presignedUrlResponse;

            options?.onSuccess?.(presignedUrlResponse);

            finalizeRecipeMutation.mutate(recipeId, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['recipes'] });
              },
            });
          } catch (uploadErr: any) {
            console.error('S3 파일 업로드 중 오류 발생:', uploadErr);
            setUploadError(uploadErr);
            options?.onError?.(uploadErr);
          } finally {
            setUploadLoading(false);
          }
        },
        onError: (apiError) => {
          console.error('Recipe creation API call failed:', apiError);
          options?.onError?.(apiError);
        },
      },
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
