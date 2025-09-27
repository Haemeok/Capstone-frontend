import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/shared/lib/queryClient";

import { finalizeRecipe } from "../api";

export const useFinalizeRecipe = () => {
  const mutation = useMutation({
    mutationFn: (recipeId: number) => finalizeRecipe(recipeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({
        queryKey: ["recipe", data.recipeId],
      });
    },
  });
  return mutation;
};
