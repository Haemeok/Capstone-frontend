import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { AIModelId,aiModels } from "@/shared/config/constants/aiModel";
import { trackReviewAction } from "@/shared/lib/review";

import { scheduleReviewGate } from "@/features/review-gate";

import { postAIRecommendedRecipe } from "./api";
import { useAIRecipeStore } from "./store";
import type { AIRecommendedRecipe, AIRecommendedRecipeRequest } from "./types";

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
  const router = useRouter();
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
      router.prefetch(`/recipes/${data.recipeId}`);
      completeGeneration(data);
      const shouldShow = trackReviewAction("ai_generation");
      if (shouldShow) scheduleReviewGate();
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
