import type { Locale } from "@/shared/i18n";
import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import type { StaticDetailedRecipeGridItem } from "@/entities/recipe";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";

type YoutubeVerifiedServerSlideProps = {
  locale: Locale;
  staticRecipes: StaticDetailedRecipeGridItem[];
  fetchFailed: boolean;
  prefetch?: boolean | null;
};

const YoutubeVerifiedServerSlide = ({
  locale,
  staticRecipes,
  fetchFailed,
  prefetch,
}: YoutubeVerifiedServerSlideProps) => {
  return (
    <RecipeSlideWithErrorBoundary
      title={searchDiscoveryMessages[locale].youtubeVerifiedTitle}
      staticRecipes={staticRecipes}
      locale={locale}
      fetchFailed={fetchFailed}
      prefetch={prefetch}
    />
  );
};

export default YoutubeVerifiedServerSlide;
