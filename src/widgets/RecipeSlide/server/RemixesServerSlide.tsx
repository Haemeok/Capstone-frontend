import type { Locale } from "@/shared/i18n";

import { getRemixesOnServer } from "@/entities/recipe/model/api.server";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";
import { recipeDetailMessages } from "./buildSlideTitle";

const RemixesServerSlide = async ({
  recipeId,
  locale,
}: {
  recipeId: string;
  locale: Locale;
}) => {
  const { content, fetchFailed } = await getRemixesOnServer(recipeId, locale);
  return (
    <RecipeSlideWithErrorBoundary
      title={recipeDetailMessages[locale].remixesTitle}
      staticRecipes={content}
      locale={locale}
      fetchFailed={fetchFailed}
    />
  );
};

export default RemixesServerSlide;
