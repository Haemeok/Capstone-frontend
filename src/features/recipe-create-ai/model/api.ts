import { api } from "@/shared/api/client";
import type { ImageGenModel } from "@/shared/config/constants/aiImageModel";
import { AIModelId } from "@/shared/config/constants/aiModel";

import {
  AIJobCreationResponse,
  AIJobStatusResponse,
  AIRecommendedRecipeRequest,
} from "@/features/recipe-create-ai/model/types";

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
