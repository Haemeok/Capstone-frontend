export const buildLocalizedRecipeHref = (
  recipeId: string,
  locale: "ko" | "ja" = "ko"
): string =>
  locale === "ja" ? `/ja/recipes/${recipeId}` : `/recipes/${recipeId}`;
