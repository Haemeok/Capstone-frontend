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

      if (fileObjects.length > 0) {
        if (!presignedUrlResponse.uploads?.length) {
          throw new Error("empty presigned uploads");
        }
        await handleS3Upload(presignedUrlResponse.uploads, fileObjects);
      }

      finalizeRecipeMutation.mutate(presignedUrlResponse.recipeId);

      queryClient.invalidateQueries({ queryKey: ["recipes"] });

      return presignedUrlResponse;
    },
  });

  return { submitRecipe, isPending, error };
};
