import type { Locale } from "@/shared/i18n";

import { getCountryPopularOnServer } from "@/entities/recipe/model/api.server";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";
import { buildCountryTitle } from "./buildSlideTitle";

const CountryPopularServerSlide = async ({ locale }: { locale: Locale }) => {
  const { countryCode, content, fetchFailed } =
    await getCountryPopularOnServer(locale);
  const metaName = content.length > 0 ? countryCode : null;
  return (
    <RecipeSlideWithErrorBoundary
      title={buildCountryTitle(locale, countryCode)}
      staticRecipes={content}
      locale={locale}
      requiresMeta
      metaName={metaName}
      fetchFailed={fetchFailed}
    />
  );
};

export default CountryPopularServerSlide;
