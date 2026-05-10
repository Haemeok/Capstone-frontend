import type { RecipeSource, Visibility } from "../model/types";

type VisibilityShape = {
  visibility?: Visibility | null;
};

type SourceShape = {
  source?: RecipeSource | null;
};

export const isPrivateRecipe = (recipe: VisibilityShape): boolean =>
  recipe.visibility === "PRIVATE";

export const isRestrictedRecipe = (recipe: VisibilityShape): boolean =>
  recipe.visibility === "RESTRICTED";

export const isAiRecipe = (recipe: SourceShape): boolean =>
  recipe.source === "AI";

export const isYoutubeRecipe = (recipe: SourceShape): boolean =>
  recipe.source === "YOUTUBE";

// R12 recommendations는 아직 V2 shape으로 옴 (source/visibility 누락).
// 백엔드가 dev로 마이그레이션해서 source를 직접 보내기 시작하면 이 어댑터 한 줄을 제거할 수 있다.
export const ensureSource = <T extends { source?: RecipeSource | null }>(
  row: T
): T & { source: RecipeSource } => {
  if (row.source) return row as T & { source: RecipeSource };
  const raw = row as unknown as Record<string, unknown>;
  if (raw.isYoutube === true) return { ...row, source: "YOUTUBE" };
  if (raw.isAiGenerated === true) return { ...row, source: "AI" };
  return { ...row, source: "USER" };
};
