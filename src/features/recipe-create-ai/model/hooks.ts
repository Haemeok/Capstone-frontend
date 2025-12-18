import { useMutation } from "@tanstack/react-query";

import { postAIRecommendedRecipe } from "./api";
import type {
  AIRecommendedRecipe,
  AIRecommendedRecipeRequest,
} from "./types";
import { aiModels, AIModelId } from "@/shared/config/constants/aiModel";
import { useAIRecipeStore } from "./store";

type CreateAIRecipeVariables = {
  request: AIRecommendedRecipeRequest;
  concept: AIModelId;
};

export const useCreateAIRecipeMutation = (callbacks?: {
  onSuccess?: (data: AIRecommendedRecipe) => void;
  onError?: (error: Error) => void;
}) => {
  const { startGeneration, completeGeneration, failGeneration, resetStore } =
    useAIRecipeStore();

  const mutation = useMutation<
    AIRecommendedRecipe,
    Error,
    CreateAIRecipeVariables
  >({
    mutationFn: ({ request, concept }) =>
      postAIRecommendedRecipe(request, concept),
    onMutate: ({ request, concept }) => {
      startGeneration(aiModels[concept], request);
    },
    onSuccess: (data) => {
      completeGeneration(data);
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      failGeneration(error.message || "레시피 생성 실패");
      callbacks?.onError?.(error);
    },
  });

  return {
    createAIRecipe: mutation.mutate,
    createAIRecipeAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    error: mutation.error,
    reset: () => {
      mutation.reset();
      resetStore();
    },
  };
};
