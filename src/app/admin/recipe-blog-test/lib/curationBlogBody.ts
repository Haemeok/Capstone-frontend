import type { StaticRecipe } from "@/entities/recipe/model/types";

const TOKEN_RE = /\{\{recipe:([^}]+)\}\}/g;

export type ValidateBodyInput = {
  expectedRecipeIds: string[];
  curationUrl: string;
};

export type ValidateBodyResult =
  | { ok: true }
  | { ok: false; errors: string[] };

export const validateCurationBlogMarkdown = (
  md: string,
  { expectedRecipeIds, curationUrl }: ValidateBodyInput,
): ValidateBodyResult => {
  const errors: string[] = [];

  const found = new Map<string, number>();
  for (const m of md.matchAll(TOKEN_RE)) {
    const id = m[1];
    found.set(id, (found.get(id) ?? 0) + 1);
  }

  for (const id of expectedRecipeIds) {
    const n = found.get(id) ?? 0;
    if (n === 0) errors.push(`recipeId ${id} 의 {{recipe:${id}}} 토큰이 본문에 없습니다.`);
    if (n > 1) errors.push(`recipeId ${id} 의 토큰이 ${n}회 등장 — 정확히 1회여야 합니다.`);
  }

  const expectedSet = new Set(expectedRecipeIds);
  for (const id of found.keys()) {
    if (!expectedSet.has(id)) {
      errors.push(`알 수 없는 recipeId 토큰: {{recipe:${id}}} — 허용된 id 만 사용해야 합니다.`);
    }
  }

  if (!md.includes(curationUrl)) {
    errors.push(`closing 권유 링크 ${curationUrl} 가 본문에 없습니다.`);
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
};

// 토큰 `{{recipe:rN}}` → 미리보기·발행 워커가 그대로 markdown image 로 보게
// `![alt](imageUrl)` 로 치환. recipe 가 누락된 토큰은 빈 문자열로 제거.
export const hydrateCurationBlogMarkdown = (
  md: string,
  recipes: StaticRecipe[],
  alts: Record<string, string>,
): string => {
  const byId = new Map(recipes.map((r) => [r.id, r]));
  return md.replace(TOKEN_RE, (_, id) => {
    const r = byId.get(id);
    if (!r || !r.imageUrl) return "";
    const alt = alts[`recipe-${id}`] ?? r.title;
    return `![${alt}](${r.imageUrl})`;
  });
};

// LLM 출력에서 ```markdown ... ``` fence 를 벗긴다 (큐레이션 코드와 같은 방어).
export const stripCodeFence = (s: string): string => {
  const trimmed = s.trim();
  const m = trimmed.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/);
  return m ? m[1].trim() : trimmed;
};

// 헤더가 인라인 spaces 로 뭉쳐 오는 패턴 복원 (큐레이션 normalizeMarkdown 차용).
export const normalizeMarkdown = (md: string): string =>
  md
    .replace(/([^\n]) +(#{1,3} )/g, "$1\n\n$2")
    .replace(/(\}\}) {2,}(?=\S)/g, "$1\n\n")
    .trim();
