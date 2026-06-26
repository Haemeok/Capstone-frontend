import type { Locale } from "@/shared/i18n";

import { getCategoryPopularOnServer } from "@/entities/recipe/model/api.server";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";
import { buildCategoryTitle } from "./buildSlideTitle";

const CategoryPopularServerSlide = async ({ locale }: { locale: Locale }) => {
  const { categoryCode, content } = await getCategoryPopularOnServer(locale);
  const metaName = content.length > 0 ? categoryCode : null;
  return (
    <RecipeSlideWithErrorBoundary
      title={buildCategoryTitle(locale, categoryCode)}
      staticRecipes={content}
      locale={locale}
      requiresMeta
      metaName={metaName}
    />
  );
};

export default CategoryPopularServerSlide;
