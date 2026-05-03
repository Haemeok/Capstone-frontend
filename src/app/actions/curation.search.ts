"use server";

import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

// 큐레이션 빌더 전용 thin wrapper. 별도 모듈인 이유는 jest.mock으로
// search 표면을 격리하기 위함.
//
// 백엔드 RecipeQueryParams 매핑:
//  - 유튜브 레시피만: types=["YOUTUBE"] (apiClient가 ?types=YOUTUBE 로 직렬화)
//  - ingredientIds는 string[] 가정. allowlist에서 단일 string으로 와도 array로 wrap.
//  - sort는 생략 (백엔드 default).
const ARRAY_KEYS = new Set(["ingredientIds", "tags"]);

const normalizeApiParams = (
  params: Record<string, string | number>,
): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    if (ARRAY_KEYS.has(k) && typeof v === "string") {
      out[k] = [v];
    } else {
      out[k] = v;
    }
  }
  return out;
};

export const searchRecipeIds = async (
  params: Record<string, string | number>,
  opts: { limit: number },
): Promise<string[]> => {
  const apiParams = {
    ...normalizeApiParams(params),
    size: opts.limit,
    types: ["YOUTUBE"],
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
