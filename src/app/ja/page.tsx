import { Suspense } from "react";

import {
  HomeAnchorAdSlot,
  HomeHeaderAnchorAdSlot,
  WebOnlyAdSlot,
} from "@/shared/adsense";
import { getDictionary } from "@/shared/i18n";
import { buildHomeMetadata } from "@/shared/lib/metadata";
import { Container } from "@/shared/ui/Container";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import {
  createOrganizationStructuredData,
  createWebsiteStructuredData,
} from "@/entities/recipe/lib/metadata/schema";
import { getStaticRecipesOnServer } from "@/entities/recipe/model/api.server";

import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import HomeHeader from "@/widgets/Header/HomeHeader";
import HomeBannerCarousel from "@/widgets/HomeBannerCarousel";
import { selectHomeBannerSlides } from "@/widgets/HomeBannerCarousel/selectSlides";
import HomeQuickNav from "@/widgets/HomeQuickNav";
import RecipeSlideWithErrorBoundary from "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary";
import {
  CategoryPopularServerSlide,
  CountryPopularServerSlide,
  QuickPopularServerSlide,
  SeasonalPopularServerSlide,
  YoutubeVerifiedServerSlide,
} from "@/widgets/RecipeSlide/server";
import { ToastDebugButton } from "@/widgets/ToastDebugPanel";

export const metadata = buildHomeMetadata("ja");

const HomePage = async () => {
  const dict = getDictionary("ja");

  const [staticPopularRecipes, staticBudgetRecipes] = await Promise.all([
    getStaticRecipesOnServer({
      period: "weekly",
      sort: "desc",
      key: "popular-recipes",
      lang: "ja",
    }),
    getStaticRecipesOnServer({
      maxCost: 10000,
      sort: "desc",
      key: "budget-recipes",
      lang: "ja",
    }),
  ]);

  const slides = selectHomeBannerSlides("ja").map((s) =>
    s.id === "youtube"
      ? {
          ...s,
          chip: dict.home.youtubeBannerChip,
          title: dict.home.youtubeBannerTitle,
        }
      : s
  );

  const jsonLd = createWebsiteStructuredData("ja");
  const orgJsonLd = createOrganizationStructuredData("ja");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Container className="pt-0">
        <Suspense fallback={<div className="h-14 md:hidden" />}>
          <HomeHeader />
        </Suspense>
        <div className="text-ink flex flex-col items-center justify-center bg-white">
          <ErrorBoundary
            fallback={<SectionErrorFallback message={dict.home.bannerError} />}
          >
            <HomeBannerCarousel slides={slides} />
          </ErrorBoundary>

          <HomeQuickNav locale="ja" messages={dict.home.quickNav} />

          <HomeHeaderAnchorAdSlot className="my-2" />

          <WebOnlyAdSlot>
            <HomeAnchorAdSlot className="my-2" />
          </WebOnlyAdSlot>

          <RecipeSlideWithErrorBoundary
            title={dict.home.popularSectionTitle}
            staticRecipes={staticPopularRecipes.content}
            locale="ja"
            fetchFailed={staticPopularRecipes.fetchFailed}
            prefetch={null}
          />

          <YoutubeVerifiedServerSlide locale="ja" prefetch={null} />

          <SeasonalPopularServerSlide locale="ja" prefetch={null} />

          <CountryPopularServerSlide locale="ja" prefetch={null} />

          <QuickPopularServerSlide locale="ja" prefetch={null} />

          <RecipeSlideWithErrorBoundary
            title={dict.home.budgetSectionTitle}
            staticRecipes={staticBudgetRecipes.content}
            locale="ja"
            fetchFailed={staticBudgetRecipes.fetchFailed}
            prefetch={null}
          />

          <CategoryPopularServerSlide locale="ja" prefetch={null} />
        </div>
      </Container>
      <DesktopFooter />
      <ToastDebugButton />
    </>
  );
};

export default HomePage;
