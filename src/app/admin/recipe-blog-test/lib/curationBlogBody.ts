import type { StaticRecipe } from "@/entities/recipe/model/types";

const TOKEN_RE = /\{\{recipe:([^}]+)\}\}/g;
const LINK_TOKEN_RE = /\{\{link:([^}]+)\}\}/g;

// 토큰 `{{recipe:rN}}` → 미리보기·발행 워커가 그대로 markdown image 로 보게
// `![alt](imageUrl)` 로 치환. recipe 가 누락된 토큰은 빈 문자열로 제거.
export const hydrateCurationBlogMarkdown = (
  md: string,
  recipes: StaticRecipe[],
  alts: Record<string, string>,
): string => {
  const byId = new Map(recipes.map((r) => [r.id, r]));
  return md
    .replace(TOKEN_RE, (_, id) => {
      const r = byId.get(id);
      if (!r || !r.imageUrl) return "";
      const alt = alts[`recipe-${id}`] ?? r.title;
      return `![${alt}](${r.imageUrl})`;
    })
    .replace(LINK_TOKEN_RE, (_, id) => {
      const r = byId.get(id);
      if (!r) return "";
      return `[${r.title} 레시피 자세히 보기 →](https://recipio.kr/recipes/${id})`;
    });
};

// LLM 출력에서 ```markdown ... ``` fence 를 벗긴다.
export const stripCodeFence = (s: string): string => {
  const trimmed = s.trim();
  const m = trimmed.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/);
  return m ? m[1].trim() : trimmed;
};

// 헤더가 인라인 spaces 로 뭉쳐 오는 패턴 복원.
export const normalizeMarkdown = (md: string): string =>
  md
    .replace(/([^\n]) +(#{1,3} )/g, "$1\n\n$2")
    .replace(/(\}\}) {2,}(?=\S)/g, "$1\n\n")
    .trim();
