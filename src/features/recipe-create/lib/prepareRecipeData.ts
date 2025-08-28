import {
  ALLOWED_CONTENT_TYPES,
  FileInfoRequest,
  FileObject,
} from "@/shared/types";

import { RecipePayload } from "@/entities/recipe/model/types";

import { RecipeFormValues } from "../model/config";
import { isOneOf } from "@/shared/lib/typeguards";

export const prepareRecipeData = (formData: RecipeFormValues) => {
  const filesToUploadInfo: FileInfoRequest[] = [];
  const fileObjects: FileObject[] = [];

  if (formData.image instanceof File) {
    if (!isOneOf(formData.image.type, ALLOWED_CONTENT_TYPES)) {
      throw new Error("Invalid image type");
    }
    filesToUploadInfo.push({
      contentType: formData.image.type,
      type: "main",
    });
    fileObjects.push({
      file: formData.image,
      type: "main",
    });
  }

  formData.steps.forEach((step, index) => {
    if (step.image instanceof File) {
      if (!isOneOf(step.image.type, ALLOWED_CONTENT_TYPES)) {
        throw new Error("Invalid image type");
      }
      filesToUploadInfo.push({
        contentType: step.image.type,
        type: "step",
        stepIndex: index,
      });
      fileObjects.push({
        file: step.image,
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
