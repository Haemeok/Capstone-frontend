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

import CategoryTabs from "@/widgets/CategoryTabs";
import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import HomeHeader from "@/widgets/Header/HomeHeader";
import HomeBannerCarousel from "@/widgets/HomeBannerCarousel";
import { HOME_BANNER_SLIDES } from "@/widgets/HomeBannerCarousel/slides";
import RecipeSlideWithErrorBoundary from "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary";
import {
  CategoryPopularServerSlide,
  CountryPopularServerSlide,
  QuickPopularServerSlide,
  SeasonalPopularServerSlide,
  YoutubeVerifiedServerSlide,
} from "@/widgets/RecipeSlide/server";
import { ToastDebugButton } from "@/widgets/ToastDebugPanel";

export const metadata = buildHomeMetadata("ko");

const HomePage = async () => {
  const dict = getDictionary("ko");

  const [staticPopularRecipes, staticBudgetRecipes] = await Promise.all([
    getStaticRecipesOnServer({
      period: "weekly",
      sort: "desc",
      key: "popular-recipes",
    }),
    getStaticRecipesOnServer({
      maxCost: 10000,
      sort: "desc",
      key: "budget-recipes",
    }),
  ]);

  const jsonLd = createWebsiteStructuredData("ko");
  const orgJsonLd = createOrganizationStructuredData("ko");

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
          <HomeHeaderAnchorAdSlot className="my-2" />

          <CategoryTabs title={dict.home.categoryTitle} />

          <ErrorBoundary
            fallback={<SectionErrorFallback message={dict.home.bannerError} />}
          >
            <HomeBannerCarousel slides={HOME_BANNER_SLIDES} />
          </ErrorBoundary>

          <WebOnlyAdSlot>
            <HomeAnchorAdSlot className="my-2" />
          </WebOnlyAdSlot>

          <RecipeSlideWithErrorBoundary
            title={dict.home.popularSectionTitle}
            staticRecipes={staticPopularRecipes.content}
            locale="ko"
            fetchFailed={staticPopularRecipes.fetchFailed}
          />

          <YoutubeVerifiedServerSlide locale="ko" />

          <SeasonalPopularServerSlide locale="ko" />

          <CountryPopularServerSlide locale="ko" />

          <QuickPopularServerSlide locale="ko" />

          <RecipeSlideWithErrorBoundary
            title={dict.home.budgetSectionTitle}
            staticRecipes={staticBudgetRecipes.content}
            locale="ko"
            fetchFailed={staticBudgetRecipes.fetchFailed}
          />

          <CategoryPopularServerSlide locale="ko" />
        </div>
      </Container>
      <DesktopFooter />
      <ToastDebugButton />
    </>
  );
};

export default HomePage;
