import type { CategoryDict } from "../../types";

export const category: CategoryDict = {
  navAriaLabel: "カテゴリー",
  countAll: "全部",
  emptyTitle: "{tagName}のレシピはまだありません",
  emptySubtitle: "最初のレシピを作ってみましょう。",
  emptyCta: "レシピを作る",
  meta: {
    fallbackTitle: "カテゴリ - Recipio",
    titleTemplate: "{emoji} {name}のレシピ集",
    descriptionTemplate:
      "{name}カテゴリの人気レシピをチェック。AIがおすすめする{name}料理を、おうちで手軽に作ってみましょう。",
    keywordRecipe: "{name} レシピ",
    keywordRecipeMethod: "{name} 作り方",
    keywordByCategory: "カテゴリ別レシピ",
    imageAltTemplate: "{name}のレシピ集",
  },
};
