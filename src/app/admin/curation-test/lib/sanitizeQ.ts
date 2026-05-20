import type { CurationParams } from "@/entities/curation";

// TEMP: 검색/LLM 으로 흘러가는 q 에서 의미 없는 보조어 제거.
// slug 계산에는 적용하지 않는다 — 이미 raw q 로 발행된 기록과의 slug 매칭을
// 살리기 위함. 추후 백엔드 검색 쪽으로 흡수 예정.
const Q_STRIP_TERMS = ["레시피", "만드는 법", "만드는법", "만들기", "요리"] as const;

const stripQ = (q: string): string => {
  let out = q;
  for (const t of Q_STRIP_TERMS) {
    out = out.split(t).join(" ");
  }
  return out.replace(/\s+/g, " ").trim();
};

export const sanitizeQParam = (params: CurationParams): CurationParams => {
  if (typeof params.q !== "string") return params;
  const cleaned = stripQ(params.q);
  if (cleaned === params.q) return params;
  return { ...params, q: cleaned };
};
