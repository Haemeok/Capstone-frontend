import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Visibility } from "@/entities/recipe/model/types";

import { useToastStore } from "@/widgets/Toast/model/store";

import { patchRecipeVisibility } from "./api";

type Options = {
  onSuccess?: (next: Visibility) => void;
};

const useRecipeVisibilityMutation = (
  recipeId: string,
  options?: Options
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: (next: Visibility) => patchRecipeVisibility(recipeId, next),
    onSuccess: (_data, next) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      addToast({
        message:
          next === "PRIVATE"
            ? "비공개로 전환됐어요"
            : "공개로 전환됐어요",
        variant: "default",
        size: "small",
        position: "bottom",
      });
      options?.onSuccess?.(next);
    },
  });
};

export default useRecipeVisibilityMutation;
