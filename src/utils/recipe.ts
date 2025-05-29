import { FileObject } from '@/type/file';
import { FileInfoRequest } from '@/type/file';
import { RecipePayload } from '@/type/recipe';
import { convertImageToWebP } from '@/utils/image';
import { RecipeFormValues } from '@/type/recipe';
import { PageResponse } from '@/type/query';

export const prepareRecipeData = async (
  formData: RecipeFormValues,
): Promise<{
  recipeData: RecipePayload;
  filesToUploadInfo: FileInfoRequest[];
  fileObjects: FileObject[];
}> => {
  const filesToUploadInfo: FileInfoRequest[] = [];
  const fileObjects: FileObject[] = [];

  if (formData.imageFile && formData.imageFile[0]) {
    const mainImageFileOriginal = formData.imageFile[0];
    let mainFileToProcess: File = mainImageFileOriginal;
    let mainContentType: string = mainImageFileOriginal.type;

    if (mainImageFileOriginal.type.startsWith('image/')) {
      const webpResult = await convertImageToWebP(mainImageFileOriginal);
      if (webpResult) {
        mainFileToProcess = new File([webpResult.blob], webpResult.filename, {
          type: 'image/webp',
        });
        mainContentType = 'image/webp';
      }
    }
    // FileInfoRequest에 filename 추가 (서버에서 파일 식별 및 Presigned URL 생성 시 사용될 수 있음)
    filesToUploadInfo.push({
      type: 'main',
      contentType: mainContentType as FileInfoRequest['contentType'],
    });
    fileObjects.push({
      file: mainFileToProcess,
      type: 'main',
    });
  }

  const stepImageProcessingPromises = formData.steps.map(
    async (step, index) => {
      if (step.imageFile && step.imageFile[0]) {
        const stepImageFileOriginal = step.imageFile[0];
        let stepFileToProcess: File = stepImageFileOriginal;
        let stepContentType: string = stepImageFileOriginal.type;

        if (stepImageFileOriginal.type.startsWith('image/')) {
          const webpResult = await convertImageToWebP(stepImageFileOriginal);
          if (webpResult) {
            stepFileToProcess = new File(
              [webpResult.blob],
              webpResult.filename,
              { type: 'image/webp' },
            );
            stepContentType = 'image/webp';
          }
        }
        return {
          // 각 스텝의 처리 결과를 반환
          fileInfo: {
            type: 'step' as 'step', // 타입 명시
            contentType: stepContentType as FileInfoRequest['contentType'],
            stepIndex: index,

            // contentLength: stepFileToProcess.size,
          },
          fileObject: {
            file: stepFileToProcess,
            type: 'step' as 'step',
            stepIndex: index,
            // filename: stepFilename (FileObject 타입에 filename 추가 고려)
          },
        };
      }
      return null; // 이미지가 없는 스텝은 null 반환
    },
  );

  // 모든 스텝 이미지 처리가 완료될 때까지 기다림
  const processedStepImages = (
    await Promise.all(stepImageProcessingPromises)
  ).filter((result): result is NonNullable<typeof result> => result !== null);

  processedStepImages.forEach((processed) => {
    filesToUploadInfo.push(processed.fileInfo);
    fileObjects.push(processed.fileObject);
  });

  const recipeData: RecipePayload = {
    title: formData.title,
    description: formData.description,
    cookingTime: Number(formData.cookingTime) || 0,
    servings: Number(formData.servings) || 0,
    dishType: formData.dishType,
    imageKey: formData.imageKey,

    ingredients: formData.ingredients.filter((i) => i.name?.trim()),
    steps: formData.steps
      .filter((s) => s.instruction?.trim())
      .map((s) => ({
        stepNumber: s.stepNumber,
        instruction: s.instruction,
        ingredients: s.ingredients || [],
      })),
    cookingTools: formData.cookingTools || [],
    tagNames: formData.tagNames || [],
  };

  return {
    recipeData,
    filesToUploadInfo,
    fileObjects,
  };
};

export const formatTimeAgo = (
  date: Date | string | number,
  now: Date = new Date(),
): string => {
  const then =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  if (isNaN(then?.getTime())) {
    console.error('Invalid date provided to formatTimeAgo:', date);
    return '유효하지 않은 날짜';
  }

  const seconds = Math.round((now.getTime() - then.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30.44);
  const years = Math.round(days / 365.25);

  if (seconds < 0) {
    console.warn(
      "Future date provided to formatTimeAgo, treating as 'just now'. Input:",
      date,
    );
    return '방금 전';
  }

  if (seconds < 60) {
    return '방금 전';
  } else if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else if (days === 1) {
    return '어제';
  } else if (days < 7) {
    return `${days}일 전`;
  } else if (weeks < 5) {
    return `${weeks}주 전`;
  } else if (months < 12) {
    return `${months}개월 전`;
  }

  if (now.getFullYear() === then.getFullYear()) {
    return `${then.getMonth() + 1}월 ${then.getDate()}일`;
  } else {
    return `${then.getFullYear()}년 ${then.getMonth() + 1}월 ${then.getDate()}일`;
  }
};

export const formatPrice = (
  value: number | string | null | undefined,
  currencySymbol: string = '',
  symbolPosition: 'prefix' | 'suffix' = 'suffix',
): string => {
  if (value === null || value === undefined || value === '') {
    const defaultValue = '0';
    return symbolPosition === 'prefix'
      ? `${currencySymbol}${defaultValue}`
      : `${defaultValue}${currencySymbol}`;
  }

  const num = Number(value);

  if (isNaN(num)) {
    console.error('Invalid number provided to formatPrice:', value);
    const errorValue = '0';
    return symbolPosition === 'prefix'
      ? `${currencySymbol}${errorValue}`
      : `${errorValue}${currencySymbol}`;
  }

  try {
    const formattedNumber = new Intl.NumberFormat('ko-KR').format(num);

    if (symbolPosition === 'prefix') {
      return `${currencySymbol}${formattedNumber}`;
    } else {
      return `${formattedNumber}${currencySymbol}`;
    }
  } catch (error) {
    console.warn(
      'Intl.NumberFormat not supported or failed, using fallback for formatPrice:',
      error,
    );

    const parts = String(num).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const fallbackFormattedNumber = parts.join('.');

    if (symbolPosition === 'prefix') {
      return `${currencySymbol}${fallbackFormattedNumber}`;
    } else {
      return `${fallbackFormattedNumber}${currencySymbol}`;
    }
  }
};

export const getNextPageParam = <T>(lastPage: PageResponse<T>) => {
  if (lastPage.page.totalPages === 0) return null;
  return lastPage.page.number === lastPage.page.totalPages - 1
    ? null
    : lastPage.page.number + 1;
};
