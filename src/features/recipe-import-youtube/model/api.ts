import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";
import type { ImageGenModel } from "@/shared/config/constants/aiImageModel";

import {
  JobCreationResponse,
  JobStatusResponse,
  YoutubeDuplicateCheckResponse,
  YoutubeImportResponse,
} from "./types";

export const triggerYoutubeImport = async (
  url: string
): Promise<YoutubeImportResponse> => {
  // api.post(url, data, config) 형태이므로
  // 쿼리 파라미터로 보내기 위해 data는 null, config에 params를 설정합니다.
  // AI 레시피 생성 시간이 길어질 수 있으므로 timeout을 5분으로 설정합니다.
  return api.post<YoutubeImportResponse>(END_POINTS.RECIPE_EXTRACT, null, {
    params: { url },
    timeout: 10 * 60 * 1000,
  });
};

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
