import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { handleS3Upload } from "@/shared/api/file";
import { ApiError } from "@/shared/api/errors";
import { triggerHaptic } from "@/shared/lib/bridge";
import { FileInfoRequest, FileObject } from "@/shared/types";

import { postRecipe } from "@/entities/recipe/model/api";
import { RecipePayload } from "@/entities/recipe/model/types";

import { useToastStore } from "@/widgets/Toast/model/store";
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
  const router = useRouter();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();
  const finalizeRecipeMutation = useFinalizeRecipe();

  const { mutate: submitRemix, isPending, error } = useMutation({
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
      addToast({ message: "편집한 레시피가 저장되었어요", variant: "success" });
      router.replace(`/recipes/${data.recipeId}`);
    },
    onError: (error: unknown, vars) => {
      if (ApiError.isApiError(error)) {
        const code = String(error.data?.code ?? "");
        if (code === REMIX_ALREADY_EXISTS_CODE) {
          addToast({ message: "이미 편집한 레시피예요", variant: "error" });
          router.replace(`/recipes/${vars.originRecipeId}`);
          return;
        }
        if (code === REMIX_NOT_ALLOWED_CODE) {
          addToast({ message: "이 레시피는 편집할 수 없어요", variant: "error" });
          router.replace(`/recipes/${vars.originRecipeId}`);
          return;
        }
      }
      addToast({ message: "잠시 후 다시 시도해주세요", variant: "error" });
    },
  });

  return { submitRemix, isPending, error };
};
