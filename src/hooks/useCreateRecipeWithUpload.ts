import { useState, useCallback } from 'react';
import { RecipeFormValues, RecipePayload } from '@/type/recipe';
import { FileInfoRequest, PresignedUrlResponse } from '@/type/file';
import { postRecipe, handleS3Upload } from '@/api/recipe';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prepareRecipeData } from '@/utils/recipe';

interface UseCreateRecipeOptions {
  onSuccess?: (data: PresignedUrlResponse) => void;
  onError?: (error: Error) => void;
}

export const useCreateRecipeWithUpload = () => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  // Recipe 생성 및 Pre-signed URL 요청 Mutation
  const createRecipeMutation = useMutation<
    PresignedUrlResponse,
    Error,
    { recipe: RecipePayload; files: FileInfoRequest[] }
  >({
    mutationFn: postRecipe, // API 함수 직접 전달
  });

  // 메인 mutate 함수
  const mutate = useCallback(
    async (formData: RecipeFormValues, options?: UseCreateRecipeOptions) => {
      setUploadLoading(false); // S3 업로드 상태 초기화
      setUploadError(null);
      createRecipeMutation.reset(); // 이전 mutation 상태 초기화

      let preparedData: ReturnType<typeof prepareRecipeData>;
      try {
        // 1. 데이터 준비
        preparedData = prepareRecipeData(formData);
      } catch (prepError: any) {
        console.error('Recipe data preparation failed:', prepError);
        options?.onError?.(prepError);
        return; // 준비 실패 시 중단
      }

      const { recipeData, filesToUploadInfo, fileObjects } = preparedData;

      // 2. 레시피 생성 API 호출 (Pre-signed URL 요청 포함)
      createRecipeMutation.mutate(
        { recipe: recipeData, files: filesToUploadInfo },
        {
          onSuccess: async (presignedUrlResponse) => {
            setUploadLoading(true); // S3 업로드 시작 상태
            setUploadError(null);
            console.log('Presigned URL Response:', presignedUrlResponse); // <--- 로그 추가
            console.log('File Objects to Upload:', fileObjects);
            try {
              // 3. S3 업로드 실행
              await handleS3Upload(presignedUrlResponse.uploads, fileObjects);

              // 4. 최종 성공 처리
              options?.onSuccess?.(presignedUrlResponse); // 성공 콜백 호출
              queryClient.invalidateQueries({ queryKey: ['recipes'] }); // 캐시 무효화
            } catch (uploadErr: any) {
              // S3 업로드 실패 처리
              console.error('S3 파일 업로드 중 오류 발생:', uploadErr);
              setUploadError(uploadErr); // 업로드 에러 상태 업데이트
              options?.onError?.(uploadErr); // 에러 콜백 호출
            } finally {
              setUploadLoading(false); // S3 업로드 완료 (성공/실패 무관)
            }
          },
          onError: (apiError) => {
            // API 호출 자체 실패 처리
            console.error('Recipe creation API call failed:', apiError);
            options?.onError?.(apiError); // 에러 콜백 호출
          },
        },
      );
    },
    [createRecipeMutation, queryClient],
  ); // useCallback 의존성 배열

  // 결합된 상태 반환
  const isLoading = createRecipeMutation.isPending || uploadLoading;
  const isError = createRecipeMutation.isError || !!uploadError;
  const error = (createRecipeMutation.error || uploadError) as Error | null;
  // 최종 성공은 API 성공하고, S3 업로드 중이 아니며, S3 에러가 없을 때
  const isSuccess =
    createRecipeMutation.isSuccess && !uploadLoading && !uploadError;

  return {
    mutate,
    isLoading,
    isUploading: uploadLoading, // 개별 S3 업로드 상태도 필요하면 제공
    isSuccess,
    isError,
    error,
    data: createRecipeMutation.data, // API 응답 데이터 (PresignedUrlResponse)
  };
};
