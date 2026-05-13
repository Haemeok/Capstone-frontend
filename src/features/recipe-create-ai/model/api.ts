import { api } from "@/shared/api/client";
import type { ImageGenModel } from "@/shared/config/constants/aiImageModel";
import { AIModelId } from "@/shared/config/constants/aiModel";
import { END_POINTS } from "@/shared/config/constants/api";

import {
  AIJobCreationResponse,
  AIJobStatusResponse,
  AIRecommendedRecipe,
  AIRecommendedRecipeRequest,
} from "@/features/recipe-create-ai/model/types";

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

export const createAIRecipeJobV2 = async (
  aiRequest: AIRecommendedRecipeRequest,
  concept: AIModelId,
  idempotencyKey: string,
  imageGenModel?: ImageGenModel
): Promise<AIJobCreationResponse> => {
  const params: Record<string, string> = { concept };
  if (imageGenModel) params.imageGenModel = imageGenModel;

  return api.post<AIJobCreationResponse>(
    "/dev/recipes/ai",
    { aiRequest },
    {
      params,
      headers: { "Idempotency-Key": idempotencyKey },
    }
  );
};

export const getAIRecipeJobStatus = async (
  jobId: string
): Promise<AIJobStatusResponse> => {
  return api.get<AIJobStatusResponse>(`/dev/recipes/ai/status/${jobId}`);
};
