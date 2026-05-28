import type { CurationParams } from "@/entities/curation";

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
