import { useMutation } from "@tanstack/react-query";
import { finalizeRecipe } from "../api";
import { queryClient } from "@/shared/lib/queryClient";

export const useFinalizeRecipe = () => {
  const mutation = useMutation({
    mutationFn: (recipeId: number) => finalizeRecipe(recipeId),
    onSuccess: (data) => {
      console.log("Recipe ID:", data.recipeId);
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({
        queryKey: ["recipe", data.recipeId],
      });
    },
  });
  return mutation;
};
