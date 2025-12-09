export const TITLE = { MIN: 5, MAX: 30 };
export const IMAGE = {
  MAX_MB: 5,
  MIME: /^image\/(png|jpe?g|webp|gif|avif)$/i,
};
export const SERVINGS = { MIN: 1 };
export const COOKING_TIME = { MIN: 1 };
export const DESCRIPTION = { MIN: 10 };
export const INGREDIENTS = { MIN: 1 };
export const STEPS = { MIN: 1 };

export const FIELD_LABELS: Record<string, string> = {
  title: "레시피 제목",
  image: "대표 이미지",
  ingredients: "재료",
  cookingTime: "조리시간",
  servings: "인분",
  dishType: "카테고리",
  description: "레시피 설명",
  steps: "조리 과정",
  cookingTools: "조리 도구",
  tags: "태그",
};
