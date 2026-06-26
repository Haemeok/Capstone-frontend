import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError, getErrorData } from "@/shared/api/errors";
import { handleS3Upload } from "@/shared/api/file";
import { useLocalizedRouter, useRecipeFormDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { FileInfoRequest, FileObject } from "@/shared/types";

import { postRecipe } from "@/entities/recipe/model/api";
import { RecipePayload } from "@/entities/recipe/model/types";

import { useToastStore } from "@/shared/ui/toast/model/store";

import { useFinalizeRecipe } from "./useFinalizeRecipe";

const REMIX_ALREADY_EXISTS_CODE = "211";
const REMIX_NOT_ALLOWED_CODE = "212";

type SubmitRemixVars = {
  originRecipeId: string;
  recipe: RecipePayload;
  /** FileInfoRequest[] 로 postRecipe에 전달할 파일 메타 */
  fileInfos: FileInfoRequest[];
  /** FileObject[] 로 S3 업로드에 전달할 실제 파일 */
  fileObjects: FileObject[];
};

export const useSubmitRemix = () => {
  const router = useLocalizedRouter();
  const { addToast } = useToastStore();
  const { ui } = useRecipeFormDict();
  const queryClient = useQueryClient();
  const finalizeRecipeMutation = useFinalizeRecipe();

  const {
    mutate: submitRemix,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (vars: SubmitRemixVars) => {
      const { recipe, fileInfos, fileObjects, originRecipeId } = vars;

      const presignedUrlResponse = await postRecipe({
        recipe,
        files: fileInfos,
      });

      if (fileObjects.length > 0) {
        if (!presignedUrlResponse.uploads?.length) {
          throw new Error("empty presigned uploads");
        }
        await handleS3Upload(presignedUrlResponse.uploads, fileObjects);
      }

      finalizeRecipeMutation.mutate(presignedUrlResponse.recipeId);

      queryClient.invalidateQueries({ queryKey: ["recipes"] });

      return { ...presignedUrlResponse, originRecipeId };
    },
    onSuccess: (data) => {
      triggerHaptic("Success");
      addToast({ message: ui.remixSuccess, variant: "success" });
      router.replace(`/recipes/${data.recipeId}`);
    },
    onError: (error: unknown, vars) => {
      if (ApiError.isApiError(error)) {
        const errorData = getErrorData(error);
        const code = String(errorData?.code ?? "");
        if (code === REMIX_ALREADY_EXISTS_CODE) {
          addToast({ message: ui.remixAlreadyCloned, variant: "error" });
          router.replace(`/recipes/${vars.originRecipeId}`);
          return;
        }
        if (code === REMIX_NOT_ALLOWED_CODE) {
          addToast({ message: ui.remixNotCloneable, variant: "error" });
          router.replace(`/recipes/${vars.originRecipeId}`);
          return;
        }
      }
      addToast({ message: ui.remixGeneric, variant: "error" });
    },
  });

  return { submitRemix, isPending, error };
};
