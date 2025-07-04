import { FileInfoRequest, FileObject } from "@/shared/types";
import { RecipeFormValues } from "../model/types";
import { RecipePayload } from "@/entities/recipe/model/types";

export const prepareRecipeData = async (
  formData: RecipeFormValues
): Promise<{
  recipeData: RecipePayload;
  filesToUploadInfo: FileInfoRequest[];
  fileObjects: FileObject[];
}> => {
  const filesToUploadInfo: FileInfoRequest[] = [];
  const fileObjects: FileObject[] = [];

  if (formData.imageFile && formData.imageFile[0]) {
    const mainImageFile = formData.imageFile[0];

    filesToUploadInfo.push({
      type: "main",
      contentType: mainImageFile.type as FileInfoRequest["contentType"],
    });
    fileObjects.push({
      file: mainImageFile,
      type: "main",
    });
  }

  formData.steps.forEach((step, index) => {
    if (step.imageFile && step.imageFile[0]) {
      const stepImageFile = step.imageFile[0];

      filesToUploadInfo.push({
        type: "step",
        contentType: stepImageFile.type as FileInfoRequest["contentType"],
        stepIndex: index,
      });
      fileObjects.push({
        file: stepImageFile,
        type: "step",
        stepIndex: index,
      });
    }
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
        stepImageKey: undefined,
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
