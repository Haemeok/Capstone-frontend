// src/hooks/useCreateRecipeWithUpload.ts
import { useState } from 'react';
import { RecipeFormValues, RecipePayload } from '@/type/recipe';
import { FileInfoRequest } from '@/type/file';
import { postPresignedUrls, uploadFileToS3, postRecipe } from '@/api/recipe';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 누락된 타입 정의 추가
interface RecipeCreateResponse {
  id: number;
  title: string;
}

interface UploadResult {
  fileKey: string;
  success: boolean;
  originalIndex: number;
  error?: Error;
}

interface UseCreateRecipeOptions {
  onSuccess?: (data: RecipeCreateResponse) => void;
  onError?: (error: Error) => void;
}

interface CreateRecipeMutateArgs extends RecipeFormValues {}

export const useCreateRecipeWithUpload = () => {
  // 파일 업로드 상태를 관리하기 위한 별도의 상태 변수 (useMutation으로 대체할 수 없는 부분)
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  const queryClient = useQueryClient();

  // Recipe 생성 mutation
  const createRecipeMutation = useMutation({
    mutationFn: (payload: RecipePayload) => postRecipe(payload as any),
  });

  const processUpload = async (
    formData: CreateRecipeMutateArgs,
    options?: UseCreateRecipeOptions,
  ) => {
    setUploadLoading(true);
    setUploadError(null);

    try {
      // 1. 업로드할 파일 목록 및 정보 준비
      const filesToUploadInfo: FileInfoRequest[] = [];
      const fileObjects: {
        file: File;
        type: 'main' | 'step';
        stepIndex?: number;
      }[] = [];

      if (formData.imageFile) {
        filesToUploadInfo.push({
          fileName: formData.imageFile[0].name,
          fileType: formData.imageFile[0].type,
        });
        fileObjects.push({ file: formData.imageFile[0], type: 'main' });
      } else {
        throw new Error('레시피 대표 이미지는 필수입니다.');
      }

      formData.steps.forEach((step, index) => {
        console.log('step.stepImageFile:', step.stepImageFile, step);
        if (step.stepImageFile) {
          filesToUploadInfo.push({
            fileName: step.stepImageFile[0]?.name,
            fileType: step.stepImageFile[0]?.type,
          });
          fileObjects.push({
            file: step.stepImageFile[0],
            type: 'step',
            stepIndex: index,
          });
        }
      });

      // 2. Pre-signed URL 요청
      const presignedUrlResponse = await postPresignedUrls(filesToUploadInfo);
      if (
        !presignedUrlResponse?.uploads ||
        presignedUrlResponse.uploads.length !== filesToUploadInfo.length
      ) {
        throw new Error('잘못된 Pre-signed URL 응답입니다.');
      }

      // 3. S3 직접 업로드 (순서 기반 매칭 가정)
      const uploadPromises = presignedUrlResponse.uploads.map(
        async (uploadInfo, index) => {
          const fileObject = fileObjects[index].file; // 순서가 같다고 가정
          try {
            await uploadFileToS3(fileObject, uploadInfo);
            return {
              fileKey: uploadInfo.fileKey,
              success: true,
              originalIndex: index,
            } as UploadResult;
          } catch (err) {
            return {
              fileKey: uploadInfo.fileKey,
              success: false,
              originalIndex: index,
              error: err,
            } as UploadResult;
          }
        },
      );

      const uploadResults = await Promise.all(uploadPromises);

      const failedUploads = uploadResults.filter((r) => !r.success);
      if (failedUploads.length > 0) {
        console.error('Failed uploads:', failedUploads);
        throw new Error(
          `${failedUploads.length}개의 파일 업로드 실패: ${failedUploads[0]?.error?.message || '알 수 없는 오류'}`,
        );
      }

      // 4. 최종 메타데이터 조합
      const successfulFileKeys = uploadResults.map((r) => r.fileKey);
      const imageKey = successfulFileKeys[0]; // 첫 번째 = 메인 이미지 가정
      // 스텝 이미지 키들을 원래 스텝 순서에 맞게 정렬 (필요시)
      const stepImageKeysMap: Record<number, string> = {};
      uploadResults.slice(1).forEach((result) => {
        const fileObj = fileObjects[result.originalIndex];
        if (fileObj.type === 'step' && typeof fileObj.stepIndex === 'number') {
          stepImageKeysMap[fileObj.stepIndex] = result.fileKey;
        }
      });
      // 스텝 순서대로 키 배열 생성
      const stepImageKeys = formData.steps
        .map((_, index) => stepImageKeysMap[index] || null)
        .filter((k) => k !== null) as string[];

      // 5. RecipePayload 객체 생성
      const recipeData: RecipePayload = {
        title: formData.title,
        description: formData.description,
        cookingTime: Number(formData.cookingTime) || 0,
        servings: Number(formData.servings) || 0,
        dishType: formData.dishType,
        imageURL: imageKey, // imageKey를 imageURL로 사용
        ingredients: formData.ingredients.filter((i) => i.name?.trim()),
        steps: formData.steps
          .filter((s) => s.instruction?.trim())
          .map((s, index) => ({
            stepNumber: s.stepNumber,
            instruction: s.instruction,
            ingredients: s.ingredients || [],
          })),
        cookingTools: formData.cookingTools || [],
      };

      // 6. 레시피 생성 API 호출
      return recipeData;
    } catch (err: any) {
      console.error('Recipe upload preparation failed:', err);
      setUploadError(err);
      throw err; // mutation.mutate의 onError로 전파
    } finally {
      setUploadLoading(false);
    }
  };

  // 전체 레시피 생성 프로세스를 위한 함수
  const mutate = async (
    formData: CreateRecipeMutateArgs,
    options?: UseCreateRecipeOptions,
  ) => {
    try {
      // 1. 파일 업로드 및 데이터 준비
      const recipeData = await processUpload(formData);

      // 2. 레시피 생성 mutation 실행
      createRecipeMutation.mutate(recipeData, {
        onSuccess: (data) => {
          options?.onSuccess?.(data);
          queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
        onError: (error) => {
          options?.onError?.(error as Error);
        },
      });
    } catch (error) {
      // 파일 업로드 단계에서 오류 발생 시 options.onError 호출
      console.error('Recipe creation process failed:', error);
      options?.onError?.(error as Error);
    }
  };

  return {
    mutate,
    // 파일 업로드 상태
    isUploading: uploadLoading,
    uploadError,
    // 레시피 생성 상태 (useMutation에서 제공하는 상태)
    isLoading: createRecipeMutation.isPending,
    isSuccess: createRecipeMutation.isSuccess,
    error: createRecipeMutation.error as Error | null,
    data: createRecipeMutation.data,
  };
};
