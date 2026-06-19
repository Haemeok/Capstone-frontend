type RecipeSlideVisibilityArgs = {
  isLoading: boolean;
  hasError: boolean;
  recipeCount: number;
  requiresMeta?: boolean;
  metaName?: string | null;
};

export const shouldHideRecipeSlide = ({
  isLoading,
  hasError,
  recipeCount,
  requiresMeta = false,
  metaName,
}: RecipeSlideVisibilityArgs): boolean => {
  if (isLoading) return false;
  if (hasError) return true;
  if (requiresMeta && (metaName == null || metaName === "")) return true;
  return recipeCount === 0;
};
