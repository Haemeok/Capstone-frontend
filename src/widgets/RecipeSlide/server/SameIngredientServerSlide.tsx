import type { Locale } from "@/shared/i18n";

import { getSameIngredientOnServer } from "@/entities/recipe/model/api.server";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";
import { buildSameIngredientTitle } from "./buildSlideTitle";

const SameIngredientServerSlide = async ({
  recipeId,
  locale,
}: {
  recipeId: string;
  locale: Locale;
}) => {
  const { ingredientName, content } = await getSameIngredientOnServer(
    recipeId,
    locale
  );
  return (
    <RecipeSlideWithErrorBoundary
      title={buildSameIngredientTitle(locale, ingredientName ?? "")}
      staticRecipes={content}
      locale={locale}
      requiresMeta
      metaName={ingredientName}
    />
  );
};

export default SameIngredientServerSlide;
