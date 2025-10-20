import { isOneOf } from "@/shared/lib/typeguards";
import {
  ALLOWED_CONTENT_TYPES,
  FileInfoRequest,
  FileObject,
} from "@/shared/types";

import { RecipePayload } from "@/entities/recipe/model/types";

import { RecipeFormValues } from "../model/config";
import { convertToWebP, shouldConvertToWebP } from "@/shared/lib/image";

const convertToWebPIfNeeded = async (
  file: File | string | null | undefined
): Promise<File | string | null> => {
  if (!file || typeof file === "string") {
    return file ?? null;
  }

  if (file.type === "image/webp") {
    return file;
  }

  if (shouldConvertToWebP(file)) {
    try {
      const { webpFile } = await convertToWebP(file);
      return webpFile;
    } catch (error) {
      console.error(
        `WebP conversion failed for ${file.name}, using original:`,
        error
      );
      return file;
    }
  }

  return file;
};

export const prepareRecipeData = async (formData: RecipeFormValues) => {
  const filesToUploadInfo: FileInfoRequest[] = [];
  const fileObjects: FileObject[] = [];

  const mainImage = await convertToWebPIfNeeded(formData.image);

  if (mainImage instanceof File) {
    if (!isOneOf(mainImage.type, ALLOWED_CONTENT_TYPES)) {
      throw new Error("Invalid image type");
    }
    filesToUploadInfo.push({
      contentType: mainImage.type,
      type: "main",
    });
    fileObjects.push({
      file: mainImage,
      type: "main",
    });
  }

  for (const [index, step] of formData.steps.entries()) {
    const stepImage = await convertToWebPIfNeeded(step.image);

    if (stepImage instanceof File) {
      if (!isOneOf(stepImage.type, ALLOWED_CONTENT_TYPES)) {
        throw new Error("Invalid image type");
      }
      filesToUploadInfo.push({
        contentType: stepImage.type,
        type: "step",
        stepIndex: index,
      });
      fileObjects.push({
        file: stepImage,
        type: "step",
        stepIndex: index,
      });
    }
  }

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
    tags: formData.tags || [],
  };

  return {
    recipeData,
    filesToUploadInfo,
    fileObjects,
  };
};
