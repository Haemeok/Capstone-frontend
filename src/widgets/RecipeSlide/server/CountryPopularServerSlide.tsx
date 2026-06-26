import type { Locale } from "@/shared/i18n";

import { getCountryPopularOnServer } from "@/entities/recipe/model/api.server";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";
import { buildCountryTitle } from "./buildSlideTitle";

const CountryPopularServerSlide = async ({ locale }: { locale: Locale }) => {
  const { countryCode, content } = await getCountryPopularOnServer(locale);
  const metaName = content.length > 0 ? countryCode : null;
  return (
    <RecipeSlideWithErrorBoundary
      title={buildCountryTitle(locale, countryCode)}
      staticRecipes={content}
      locale={locale}
      requiresMeta
      metaName={metaName}
    />
  );
};

export default CountryPopularServerSlide;
