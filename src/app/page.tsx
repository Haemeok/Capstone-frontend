import { Suspense } from "react";

import { HomeAnchorAdSlot, HomeHeaderAnchorAdSlot } from "@/shared/adsense";
import { getDictionary } from "@/shared/i18n";
import { buildHomeMetadata } from "@/shared/lib/metadata";
import {
  createOrganizationStructuredData,
  createWebsiteStructuredData,
} from "@/shared/lib/metadata/structuredData";
import { Container } from "@/shared/ui/Container";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import { getStaticRecipesOnServer } from "@/entities/recipe/model/api.server";

import CategoryTabs from "@/widgets/CategoryTabs";
import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import HomeHeader from "@/widgets/Header/HomeHeader";
import HomeBannerCarousel from "@/widgets/HomeBannerCarousel";
import { HOME_BANNER_SLIDES } from "@/widgets/HomeBannerCarousel/slides";
import CategoryPopularSlide from "@/widgets/RecipeSlide/CategoryPopularSlide";
import CountryPopularSlide from "@/widgets/RecipeSlide/CountryPopularSlide";
import QuickPopularSlide from "@/widgets/RecipeSlide/QuickPopularSlide";
import RecipeSlideWithErrorBoundary from "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary";
import SeasonalPopularSlide from "@/widgets/RecipeSlide/SeasonalPopularSlide";
import YoutubeVerifiedSlide from "@/widgets/RecipeSlide/YoutubeVerifiedSlide";
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

  const jsonLd = createWebsiteStructuredData();
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

          <HomeAnchorAdSlot className="my-2" />

          <RecipeSlideWithErrorBoundary
            title={dict.home.popularSectionTitle}
            queryKey="popular-recipes"
            period="weekly"
            isStatic
            staticRecipes={staticPopularRecipes.content}
            locale="ko"
          />

          <RecipeSlideWithErrorBoundary
            title={dict.home.budgetSectionTitle}
            queryKey="budget-recipes"
            maxCost={10000}
            isStatic
            staticRecipes={staticBudgetRecipes.content}
            locale="ko"
          />

          <SeasonalPopularSlide locale="ko" />

          <CountryPopularSlide locale="ko" />

          <QuickPopularSlide locale="ko" />

          <CategoryPopularSlide locale="ko" />

          <YoutubeVerifiedSlide locale="ko" />
        </div>
      </Container>
      <DesktopFooter />
      <ToastDebugButton />
    </>
  );
};

export default HomePage;
