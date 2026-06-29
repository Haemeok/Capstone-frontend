import type { Locale } from "@/shared/i18n";

import { getTitleKeywordOnServer } from "@/entities/recipe/model/api.server";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";
import { buildTitleKeywordTitle } from "./buildSlideTitle";

const TitleKeywordServerSlide = async ({
  recipeId,
  locale,
}: {
  recipeId: string;
  locale: Locale;
}) => {
  const { keyword, content, fetchFailed } = await getTitleKeywordOnServer(
    recipeId,
    locale
  );
  return (
    <RecipeSlideWithErrorBoundary
      title={buildTitleKeywordTitle(locale, keyword ?? "")}
      staticRecipes={content}
      locale={locale}
      requiresMeta
      metaName={keyword}
      fetchFailed={fetchFailed}
    />
  );
};

export default TitleKeywordServerSlide;
