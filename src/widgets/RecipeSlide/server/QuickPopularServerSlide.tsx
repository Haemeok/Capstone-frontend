import type { Locale } from "@/shared/i18n";

import { getQuickPopularOnServer } from "@/entities/recipe/model/api.server";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";
import { buildQuickTitle } from "./buildSlideTitle";

const QuickPopularServerSlide = async ({ locale }: { locale: Locale }) => {
  const { maxCookingTime, content, fetchFailed } =
    await getQuickPopularOnServer(locale);
  const metaName =
    content.length > 0 && maxCookingTime > 0 ? String(maxCookingTime) : null;
  return (
    <RecipeSlideWithErrorBoundary
      title={buildQuickTitle(locale, maxCookingTime)}
      staticRecipes={content}
      locale={locale}
      requiresMeta
      metaName={metaName}
      emphasizeTime
      fetchFailed={fetchFailed}
    />
  );
};

export default QuickPopularServerSlide;
