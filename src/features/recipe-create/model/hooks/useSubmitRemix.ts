import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { handleS3Upload } from "@/shared/api/file";
import { triggerHaptic } from "@/shared/lib/bridge";
import { FileInfoRequest, FileObject } from "@/shared/types";

import { postRecipe } from "@/entities/recipe/model/api";
import { RecipePayload } from "@/entities/recipe/model/types";

import { useToastStore } from "@/widgets/Toast/model/store";

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

      return { ...presignedUrlResponse, originRecipeId };
    },
    onSuccess: (data) => {
      triggerHaptic("Success");
      addToast({ message: "편집한 레시피가 저장되었어요", variant: "success" });
      router.replace(`/recipes/${data.recipeId}`);
    },
    onError: (error: unknown, vars) => {
      const code = (error as { data?: { code?: number | string } })?.data?.code;

      if (String(code) === "211") {
        addToast({ message: "이미 편집한 레시피예요", variant: "error" });
        router.replace(`/recipes/${vars.originRecipeId}`);
        return;
      }
      if (String(code) === "212") {
        addToast({ message: "이 레시피는 편집할 수 없어요", variant: "error" });
        router.replace(`/recipes/${vars.originRecipeId}`);
        return;
      }
      addToast({ message: "잠시 후 다시 시도해주세요", variant: "error" });
    },
  });

  return { submitRemix, isPending, error };
};
