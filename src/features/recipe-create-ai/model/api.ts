import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import {
  AIRecommendedRecipe,
  AIRecommendedRecipeRequest,
  AIJobCreationResponse,
  AIJobStatusResponse,
} from "@/features/recipe-create-ai/model/types";
import { AIModelId } from "@/shared/config/constants/aiModel";

export const postAIRecommendedRecipe = async (
  aiRequest: AIRecommendedRecipeRequest,
  concept: AIModelId
): Promise<AIRecommendedRecipe> => {

  const response = await api.post<AIRecommendedRecipe>(
    END_POINTS.RECIPE_AI,
    {
      aiRequest,
    },
    {
      params: {
        concept,
      },
      timeout: 10 * 60 * 1000,
    }
  );

  return response;
};

// ========== Job Polling API (V2) ==========

export const createAIRecipeJobV2 = async (
  aiRequest: AIRecommendedRecipeRequest,
  concept: AIModelId,
  idempotencyKey: string
): Promise<AIJobCreationResponse> => {
  return api.post<AIJobCreationResponse>(
    "/recipes/ai/v2",
    { aiRequest },
    {
      params: { concept },
      headers: { "Idempotency-Key": idempotencyKey },
    }
  );
};

export const getAIRecipeJobStatus = async (
  jobId: string
): Promise<AIJobStatusResponse> => {
  return api.get<AIJobStatusResponse>(`/recipes/ai/status/${jobId}`);
};
