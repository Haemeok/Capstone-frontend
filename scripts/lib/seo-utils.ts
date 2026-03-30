import * as fs from "fs";
import {
  API_BASE,
  MAX_RETRIES,
  RETRY_BACKOFF,
  TIMEOUT_MS,
} from "./seo-constants";

export type ParamSet = Record<string, string | number>;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const paramsToKey = (params: ParamSet): string =>
  JSON.stringify(
    Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, String(v)])
  );

export const fetchResultCount = async (
  paramsOrQuery: ParamSet | string
): Promise<number> => {
  const query = new URLSearchParams({
    page: "0",
    size: "1",
    sort: "createdAt,desc",
  });

  if (typeof paramsOrQuery === "string") {
    query.set("q", paramsOrQuery);
  } else {
    for (const [key, value] of Object.entries(paramsOrQuery)) {
      query.set(key, String(value));
    }
  }

  const url = `${API_BASE}?${query.toString()}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        if (res.status === 429 || (res.status >= 500 && attempt < MAX_RETRIES)) {
          await sleep(RETRY_BACKOFF[attempt]);
          continue;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      return data.page?.totalElements ?? 0;
    } catch {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_BACKOFF[attempt]);
        continue;
      }
      return -1;
    }
  }
  return -1;
};

export const classifyCategory = (
  params: Record<string, string | number>
): string => {
  const keys = Object.keys(params);
  const hasIng = keys.includes("ingredientIds");
  const hasDish = keys.includes("dishType");
  const hasTag = keys.includes("tags");
  const hasCost = keys.includes("maxCost");
  const hasQ = keys.includes("q");
  const hasNutrition = keys.some(
    (k) => (k.startsWith("min") || k.startsWith("max")) && k !== "maxCost"
  );

  if (hasQ) return "A_TEXT_KEYWORD";
  if (hasIng && hasDish && hasTag) return "J_TRIPLE";
  if (hasIng && hasNutrition) return "I_ING_NUTRITION";
  if (hasIng && hasDish) return "C_ING_DISH";
  if (hasIng && hasTag) return "D_ING_TAG";
  if (hasIng && hasCost) return "E_ING_COST";
  if (hasIng) return "B_ING_ONLY";
  if (hasNutrition && hasCost) return "K_NUTRITION_COST";
  if (hasDish && hasTag && hasCost) return "M_DISH_TAG_COST";
  if (hasDish && hasTag) return "F_DISH_TAG";
  if (hasDish && hasCost) return "L_DISH_COST";
  if (hasTag && hasCost) return "N_TAG_COST";
  if (hasCost) return "G_COST_COMBO";
  if (hasNutrition) return "H_NUTRITION_COMBO";
  if (hasDish) return "O_DISH_ONLY";
  if (hasTag) return "P_TAG_ONLY";
  return "Z_OTHER";
};

export const CATEGORY_LABELS: Record<string, string> = {
  A_TEXT_KEYWORD: "A. 텍스트 키워드",
  B_ING_ONLY: "B. 재료 단독",
  C_ING_DISH: "C. 재료×dishType",
  D_ING_TAG: "D. 재료×tags",
  E_ING_COST: "E. 재료×cost",
  F_DISH_TAG: "F. dish×tag",
  G_COST_COMBO: "G. cost 조합",
  H_NUTRITION_COMBO: "H. 영양소 조합",
  I_ING_NUTRITION: "I. 재료×영양소",
  J_TRIPLE: "J. 재료×dish×tag",
  K_NUTRITION_COST: "K. 영양소×cost",
  L_DISH_COST: "L. dish×cost",
  M_DISH_TAG_COST: "M. dish×tag×cost",
  N_TAG_COST: "N. tag×cost",
  O_DISH_ONLY: "O. dishType 단독",
  P_TAG_ONLY: "P. tag 단독",
  Z_OTHER: "기타",
};

export const safeReadJson = <T>(filePath: string): T | null => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
};
