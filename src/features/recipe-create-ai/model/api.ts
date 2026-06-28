import { api } from "@/shared/api/client";
import {
  DEFAULT_IMAGE_GEN_MODEL,
  type ImageGenModel,
} from "@/shared/config/constants/aiImageModel";
import { AIModelId } from "@/shared/config/constants/aiModel";
import type { Locale } from "@/shared/i18n";

import {
  AIJobCreationResponse,
  AIJobStatusResponse,
  AIRecommendedRecipeRequest,
} from "@/features/recipe-create-ai/model/types";

export const createAIRecipeJobV2 = async (
  aiRequest: AIRecommendedRecipeRequest,
  concept: AIModelId,
  idempotencyKey: string,
  imageGenModel: ImageGenModel = DEFAULT_IMAGE_GEN_MODEL,
  lang: Locale = "ko"
): Promise<AIJobCreationResponse> => {
  return api.post<AIJobCreationResponse>(
    "/recipes/ai",
    { aiRequest },
    {
      params: { concept, imageGenModel, ...(lang === "ko" ? {} : { lang }) },
      headers: { "Idempotency-Key": idempotencyKey },
    }
  );
};

export const getAIRecipeJobStatus = async (
  jobId: string
): Promise<AIJobStatusResponse> => {
  return api.get<AIJobStatusResponse>(`/recipes/ai/status/${jobId}`);
};
