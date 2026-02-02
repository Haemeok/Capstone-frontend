import {
  YoutubeImportResponse,
  YoutubeDuplicateCheckResponse,
  JobCreationResponse,
  JobStatusResponse,
} from "./types";
import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

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
  return api.get<YoutubeDuplicateCheckResponse>("/recipes/youtube/check", {
    params: { url },
  });
};

// ========== Job Polling API (V2) ==========

export const createExtractionJobV2 = async (
  url: string,
  idempotencyKey: string
): Promise<JobCreationResponse> => {
  return api.post<JobCreationResponse>("/recipes/extract/v2", null, {
    params: { url },
    headers: { "Idempotency-Key": idempotencyKey },
  });
};

export const getYoutubeJobStatus = async (
  jobId: string
): Promise<JobStatusResponse> => {
  return api.get<JobStatusResponse>(`/recipes/youtube/status/${jobId}`);
};
