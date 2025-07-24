import { useMutation } from "@tanstack/react-query";

import { postAIRecommendedRecipe } from "./api";
import type { AIRecommendedRecipe, AIRecommendedRecipeRequest } from "./types";

export const useCreateAIRecipeMutation = (callbacks?: {
  onSuccess?: (data: AIRecommendedRecipe) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation<
    AIRecommendedRecipe,
    Error,
    AIRecommendedRecipeRequest
  >({
    mutationFn: postAIRecommendedRecipe,
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
  });

  return {
    createAIRecipe: mutation.mutate,
    createAIRecipeAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    error: mutation.error,
  };
};
