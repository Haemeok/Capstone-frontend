import { api } from "@/shared/api/client";
import type { ImageGenModel } from "@/shared/config/constants/aiImageModel";

import {
  JobCreationResponse,
  JobStatusResponse,
  YoutubeDuplicateCheckResponse,
} from "./types";

export const checkYoutubeDuplicate = async (
  url: string
): Promise<YoutubeDuplicateCheckResponse> => {
  return api.get<YoutubeDuplicateCheckResponse>("/dev/recipes/youtube/check", {
    params: { url },
  });
};

// ========== Job Polling API (V2) ==========

export const createExtractionJobV2 = async (
  url: string,
  idempotencyKey: string,
  imageGenModel?: ImageGenModel
): Promise<JobCreationResponse> => {
  const params: Record<string, string> = { url };
  if (imageGenModel) params.imageGenModel = imageGenModel;

  return api.post<JobCreationResponse>("/dev/recipes/youtube/extract", null, {
    params,
    headers: { "Idempotency-Key": idempotencyKey },
  });
};

export const getYoutubeJobStatus = async (
  jobId: string
): Promise<JobStatusResponse> => {
  return api.get<JobStatusResponse>(`/dev/recipes/youtube/status/${jobId}`);
};
