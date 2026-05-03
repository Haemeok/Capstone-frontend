"use server";

import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

// 큐레이션 빌더 전용 thin wrapper. 별도 모듈인 이유는 jest.mock으로
// search 표면을 격리하기 위함 (test에서 fetch mock 안 깔아도 됨).
// 인증·refresh·에러 정규화를 그대로 받기 위해 raw fetch가 아닌 apiClient를 통한다.
// 응답 shape는 백엔드 합의에 따라 셋 중 하나일 수 있어 모두 폴백 처리.
// (spec §11 Q1: youtubeOnly 옵션은 백엔드와 합의 필요)
export const searchRecipeIds = async (
  params: Record<string, string | number>,
  opts: { limit: number },
): Promise<string[]> => {
  const apiParams = {
    ...params,
    size: opts.limit,
    youtubeOnly: true,
  };
  const res = await api.get<{
    content?: Array<{ id: string }>;
    ids?: string[];
    data?: Array<{ id: string }>;
  }>(END_POINTS.RECIPE_SEARCH, { params: apiParams });

  return (
    res.ids ??
    res.content?.map((r) => r.id) ??
    res.data?.map((r) => r.id) ??
    []
  );
};
