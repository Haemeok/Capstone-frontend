import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleS3Upload } from "@/shared/api/file";
import {
  ALLOWED_CONTENT_TYPES,
  FileInfoRequest,
  FileObject,
} from "@/shared/types";
import { isOneOf } from "@/shared/lib/typeguards";

import { postRecipe } from "@/entities/recipe/model/api";
import { RecipePayload } from "@/entities/recipe/model/types";

import { useFinalizeRecipe } from "./useFinalizeRecipe";
import { convertToWebPIfNeeded } from "@/shared/lib/image";
import { postRecipeReactions } from "../api";

type AdminRecipeUploadParams = {
  recipeData: RecipePayload;
  mainImage: File;
  likeCount?: number;
  ratingCount?: number;
};

export const useAdminRecipeUpload = () => {
  const queryClient = useQueryClient();
  const finalizeRecipeMutation = useFinalizeRecipe();

  const {
    mutate: uploadRecipe,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({
      recipeData,
      mainImage,
      likeCount = 0,
      ratingCount = 0,
    }: AdminRecipeUploadParams) => {
      const filesToUploadInfo: FileInfoRequest[] = [];
      const fileObjects: FileObject[] = [];

      if (!isOneOf(mainImage.type, ALLOWED_CONTENT_TYPES)) {
        throw new Error("Invalid image type");
      }

      const mainWebpImage = await convertToWebPIfNeeded(mainImage);

      if (mainWebpImage instanceof File) {
        if (!isOneOf(mainWebpImage.type, ALLOWED_CONTENT_TYPES)) {
          throw new Error("Invalid image type");
        }
        filesToUploadInfo.push({
          contentType: mainWebpImage.type,
          type: "main",
        });
        fileObjects.push({
          file: mainWebpImage,
          type: "main",
        });
      }

      const presignedUrlResponse = await postRecipe({
        recipe: recipeData,
        files: filesToUploadInfo,
      });

      if (fileObjects.length > 0) {
        if (!presignedUrlResponse.uploads?.length) {
          throw new Error("empty presigned uploads");
        }
        await handleS3Upload(presignedUrlResponse.uploads, fileObjects);
      }

      await finalizeRecipeMutation.mutateAsync(presignedUrlResponse.recipeId);

      await postRecipeReactions(presignedUrlResponse.recipeId, {
        likeCount,
        ratingCount,
      });

      queryClient.invalidateQueries({ queryKey: ["recipes"] });

      return presignedUrlResponse;
    },
  });

  return { uploadRecipe, isPending, error };
};
