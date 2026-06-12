export const buildLocalizedRecipeHref = (
  recipeId: string,
  locale: "ko" | "ja" | "en" = "ko"
): string => {
  if (locale === "ja") return `/ja/recipes/${recipeId}`;
  if (locale === "en") return `/en/recipes/${recipeId}`;
  return `/recipes/${recipeId}`;
};
