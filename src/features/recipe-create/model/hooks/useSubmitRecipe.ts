import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleS3Upload } from "@/shared/api/file";

import { editRecipe, postRecipe } from "@/entities/recipe/model/api";

import { prepareRecipeData } from "../../lib/prepareRecipeData";
import { RecipeFormValues } from "../config";
import { useFinalizeRecipe } from "./useFinalizeRecipe";

export const useSubmitRecipe = () => {
  const queryClient = useQueryClient();
  const finalizeRecipeMutation = useFinalizeRecipe();

  const {
    mutate: submitRecipe,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (variables: {
      formData: RecipeFormValues;
      recipeId?: number;
    }) => {
      const { formData, recipeId } = variables;

      const { recipeData, filesToUploadInfo, fileObjects } =
        prepareRecipeData(formData);

      const presignedUrlResponse = await (recipeId
        ? editRecipe({ recipe: recipeData, files: filesToUploadInfo, recipeId })
        : postRecipe({ recipe: recipeData, files: filesToUploadInfo }));

      (async () => {
        try {
          if (fileObjects.length > 0) {
            await handleS3Upload(presignedUrlResponse.uploads, fileObjects);
          }
          finalizeRecipeMutation.mutate(presignedUrlResponse.recipeId);

          await queryClient.invalidateQueries({ queryKey: ["recipes"] });
        } catch (error) {
          console.error("백그라운드 파일 업로드 또는 최종 확정 실패:", error);
        }
      })();

      return presignedUrlResponse;
    },
  });

  return { submitRecipe, isPending, error };
};
