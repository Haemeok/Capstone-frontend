import { api } from "@/shared/api/client";
import {
  DEFAULT_IMAGE_GEN_MODEL,
  type ImageGenModel,
} from "@/shared/config/constants/aiImageModel";

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
  imageGenModel: ImageGenModel = DEFAULT_IMAGE_GEN_MODEL
): Promise<JobCreationResponse> => {
  return api.post<JobCreationResponse>("/dev/recipes/youtube/extract", null, {
    params: { url, imageGenModel },
    headers: { "Idempotency-Key": idempotencyKey },
  });
};

export const getYoutubeJobStatus = async (
  jobId: string
): Promise<JobStatusResponse> => {
  return api.get<JobStatusResponse>(`/dev/recipes/youtube/status/${jobId}`);
};
