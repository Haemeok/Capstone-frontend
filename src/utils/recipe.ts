import { FileObject } from '@/type/file';
import { FileInfoRequest } from '@/type/file';
import { RecipePayload } from '@/type/recipe';

import { RecipeFormValues } from '@/type/recipe';

export const prepareRecipeData = (
  formData: RecipeFormValues,
): {
  recipeData: RecipePayload;
  filesToUploadInfo: FileInfoRequest[];
  fileObjects: FileObject[];
} => {
  const filesToUploadInfo: FileInfoRequest[] = [];
  const fileObjects: FileObject[] = [];

  // 메인 이미지 처리
  if (formData.imageFile && formData.imageFile[0]) {
    const mainImageFile = formData.imageFile[0];
    filesToUploadInfo.push({
      type: 'main',
      contentType: mainImageFile.type as FileInfoRequest['contentType'],
    });
    fileObjects.push({ file: mainImageFile, type: 'main' });
  } else {
    throw new Error('레시피 대표 이미지는 필수입니다.');
  }

  // 스텝 이미지 처리
  formData.steps.forEach((step, index) => {
    if (step.imageFile && step.imageFile[0]) {
      const stepImageFile = step.imageFile[0];
      filesToUploadInfo.push({
        type: 'step',
        contentType: stepImageFile.type as FileInfoRequest['contentType'],
        stepIndex: index,
      });
      fileObjects.push({
        file: stepImageFile,
        type: 'step',
        stepIndex: index,
      });
    }
  });

  // RecipePayload 생성 (imageURL 제거 또는 서버 처리 의존)
  // postRecipe API가 imageURL을 생성하거나 받지 않는다고 가정
  const recipeData: RecipePayload = {
    title: formData.title,
    description: formData.description,
    cookingTime: Number(formData.cookingTime) || 0,
    servings: Number(formData.servings) || 0,
    dishType: formData.dishType,
    // imageURL 필드를 제거하거나, 서버에서 생성한다고 가정
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

  // RecipePayload 타입에 맞게 imageURL 필드 제거 혹은 서버 처리 확인 후 조정 필요
  // 여기서는 imageURL이 서버에서 처리된다고 가정하고 타입을 맞춤.
  // 만약 클라이언트에서 빈 문자열이라도 보내야 한다면 타입을 RecipePayload로 유지하고 imageURL: '' 추가
  return {
    recipeData,
    filesToUploadInfo,
    fileObjects,
  };
};
