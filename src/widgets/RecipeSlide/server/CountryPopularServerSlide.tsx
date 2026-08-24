import type { Locale } from "@/shared/i18n";

import { getCountryPopularOnServer } from "@/entities/recipe/model/api.server";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";
import { buildCountryTitle } from "./buildSlideTitle";

const CountryPopularServerSlide = async ({
  locale,
  prefetch,
}: {
  locale: Locale;
  prefetch?: boolean | null;
}) => {
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
      prefetch={prefetch}
    />
  );
};

export default CountryPopularServerSlide;
