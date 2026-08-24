import type { Locale } from "@/shared/i18n";
import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import { getYoutubeVerifiedOnServer } from "@/entities/recipe/model/api.server";

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";

const YoutubeVerifiedServerSlide = async ({
  locale,
  prefetch,
}: {
  locale: Locale;
  prefetch?: boolean | null;
}) => {
  const { content, fetchFailed } = await getYoutubeVerifiedOnServer(locale);
  return (
    <RecipeSlideWithErrorBoundary
      title={searchDiscoveryMessages[locale].youtubeVerifiedTitle}
      staticRecipes={content}
      locale={locale}
      fetchFailed={fetchFailed}
      prefetch={prefetch}
    />
  );
};

export default YoutubeVerifiedServerSlide;
