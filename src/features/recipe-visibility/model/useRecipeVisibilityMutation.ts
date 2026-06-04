import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Visibility } from "@/entities/recipe/model/types";
import { useUserStore } from "@/entities/user";

import { useToastStore } from "@/widgets/Toast/model/store";

import { patchRecipeVisibility } from "./api";

type Options = {
  onSuccess?: (next: Visibility) => void;
};

const useRecipeVisibilityMutation = (recipeId: string, options?: Options) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: (next: Visibility) => patchRecipeVisibility(recipeId, next),
    onSuccess: (_data, next) => {
      const userId = useUserStore.getState().user?.id;
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["recipes", userId] });
      }
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      queryClient.invalidateQueries({ queryKey: ["recipe-status", recipeId] });
      addToast({
        message:
          next === "PRIVATE" ? "비공개로 전환됐어요" : "공개로 전환됐어요",
        variant: "default",
        size: "small",
        position: "bottom",
      });
      options?.onSuccess?.(next);
    },
  });
};

export default useRecipeVisibilityMutation;
