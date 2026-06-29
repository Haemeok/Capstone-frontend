import type { Locale } from "@/shared/i18n";

import { getSeasonalPopularOnServer } from "@/entities/recipe/model/api.server";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";
import { buildSeasonalTitle } from "./buildSlideTitle";

const SeasonalPopularServerSlide = async ({ locale }: { locale: Locale }) => {
  const { seasonalIngredientName, content, fetchFailed } =
    await getSeasonalPopularOnServer(locale);
  const month = new Date().getMonth() + 1;
  return (
    <RecipeSlideWithErrorBoundary
      title={buildSeasonalTitle(locale, seasonalIngredientName ?? "", month)}
      staticRecipes={content}
      locale={locale}
      requiresMeta
      metaName={seasonalIngredientName}
      fetchFailed={fetchFailed}
    />
  );
};

export default SeasonalPopularServerSlide;
