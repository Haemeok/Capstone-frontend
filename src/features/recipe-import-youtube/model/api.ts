import { api } from "@/shared/api/client";
import {
  DEFAULT_IMAGE_GEN_MODEL,
  type ImageGenModel,
} from "@/shared/config/constants/aiImageModel";
import type { Locale } from "@/shared/i18n";

import {
  JobCreationResponse,
  JobStatusResponse,
  YoutubeDuplicateCheckResponse,
} from "./types";

export const checkYoutubeDuplicate = async (
  url: string,
  lang: Locale = "ko"
): Promise<YoutubeDuplicateCheckResponse> => {
  return api.get<YoutubeDuplicateCheckResponse>("/recipes/youtube/check", {
    params: { url, ...(lang === "ko" ? {} : { lang }) },
  });
};

// ========== Job Polling API (V2) ==========

export const createExtractionJobV2 = async (
  url: string,
  idempotencyKey: string,
  imageGenModel: ImageGenModel = DEFAULT_IMAGE_GEN_MODEL,
  lang: Locale = "ko"
): Promise<JobCreationResponse> => {
  return api.post<JobCreationResponse>("/recipes/youtube/extract", null, {
    params: { url, imageGenModel, ...(lang === "ko" ? {} : { lang }) },
    headers: { "Idempotency-Key": idempotencyKey },
  });
};

export const getYoutubeJobStatus = async (
  jobId: string
): Promise<JobStatusResponse> => {
  return api.get<JobStatusResponse>(`/recipes/youtube/status/${jobId}`);
};
