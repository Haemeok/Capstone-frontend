import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToastStore } from "@/widgets/Toast/model/store";

import { postRecipeVisibility } from "./api";

const useRecipeVisibilityMutation = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const recipeVisibilityMutation = useMutation({
    mutationFn: () => postRecipeVisibility(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipe", recipeId],
      });
      addToast({
        message: "레시피 공개 상태가 변경되었습니다.",
        variant: "default",
        size: "small",
        position: "bottom",
      });
    },
  });

  return recipeVisibilityMutation;
};

export default useRecipeVisibilityMutation;
