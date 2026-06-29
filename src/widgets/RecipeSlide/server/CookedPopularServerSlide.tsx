import type { Locale } from "@/shared/i18n";
import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import { getCookedPopularOnServer } from "@/entities/recipe/model/api.server";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";

const CookedPopularServerSlide = async ({ locale }: { locale: Locale }) => {
  const { content, fetchFailed } = await getCookedPopularOnServer(locale);
  return (
    <RecipeSlideWithErrorBoundary
      title={searchDiscoveryMessages[locale].cookedPopularTitle}
      staticRecipes={content}
      locale={locale}
      fetchFailed={fetchFailed}
    />
  );
};

export default CookedPopularServerSlide;
