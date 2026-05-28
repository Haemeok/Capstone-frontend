import type { StaticRecipe } from "@/entities/recipe/model/types";

const TOKEN_RE = /\{\{recipe:([^}]+)\}\}/g;
const LINK_TOKEN_RE = /\{\{link:([^}]+)\}\}/g;
const INGREDIENTS_TOKEN_RE = /\{\{ingredients:([^}]+)\}\}/g;
const NUTRITION_TOKEN_RE = /\{\{nutrition:([^}]+)\}\}/g;

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
    })
    .replace(INGREDIENTS_TOKEN_RE, (_, id) => {
      const r = byId.get(id);
      if (!r) return "";
      return `> 🥕 재료 (${r.title}) — 발행 시 자동 삽입`;
    })
    .replace(NUTRITION_TOKEN_RE, (_, id) => {
      const r = byId.get(id);
      if (!r) return "";
      return `> 📊 영양 (${r.title}) — 발행 시 자동 삽입`;
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
