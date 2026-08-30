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
import {
  getStaticRecipesOnServer,
  getYoutubeVerifiedOnServer,
} from "@/entities/recipe/model/api.server";

import CategoryTabs from "@/widgets/CategoryTabs";
import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import HomeHeader from "@/widgets/Header/HomeHeader";
import HomeBannerCarousel from "@/widgets/HomeBannerCarousel";
import { selectHomeBannerSlides } from "@/widgets/HomeBannerCarousel/selectSlides";
import HomeQuickNav from "@/widgets/HomeQuickNav";
import RecipeSlideWithErrorBoundary from "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary";
import {
  BudgetServerSlide,
  CategoryPopularServerSlide,
  CountryPopularServerSlide,
  QuickPopularServerSlide,
  SeasonalPopularServerSlide,
  YoutubeVerifiedServerSlide,
} from "@/widgets/RecipeSlide/server";
import { ToastDebugButton } from "@/widgets/ToastDebugPanel";

import { DesktopYoutubeImportHero } from "../_components/DesktopYoutubeImportHero";
import { HomeAdsGate } from "../_components/HomeAdsGate";

export const metadata = buildHomeMetadata("en");
export const revalidate = 259200;

const HomePage = async () => {
  const dict = getDictionary("en");

  const [staticPopularRecipes, youtubeVerifiedRecipes] = await Promise.all([
    getStaticRecipesOnServer({
      period: "weekly",
      sort: "desc",
      key: "popular-recipes",
      lang: "en",
    }),
    getYoutubeVerifiedOnServer("en"),
  ]);

  const slides = selectHomeBannerSlides("en").map((s) =>
    s.id === "youtube"
      ? {
          ...s,
          chip: dict.home.youtubeBannerChip,
          title: dict.home.youtubeBannerTitle,
        }
      : s
  );

  const jsonLd = createWebsiteStructuredData("en");
  const orgJsonLd = createOrganizationStructuredData("en");

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
      <HomeAdsGate>
        <Container className="pt-0" maxWidth="6xl">
          <Suspense fallback={<div className="h-14 md:hidden" />}>
            <HomeHeader />
          </Suspense>
          <div className="text-ink flex flex-col items-center justify-center bg-white">
            <DesktopYoutubeImportHero
              messages={dict.home.desktopYoutubeImport}
            />

            <ErrorBoundary
              fallback={
                <SectionErrorFallback message={dict.home.bannerError} />
              }
            >
              <HomeBannerCarousel slides={slides} />
            </ErrorBoundary>

            <HomeQuickNav locale="en" messages={dict.home.quickNav} />

            <CategoryTabs
              title={dict.home.categoryTitle}
              copy={dict.searchDiscovery.contentPages}
            />

            <WebOnlyAdSlot>
              <HomeHeaderAnchorAdSlot className="my-2" />
              <HomeAnchorAdSlot className="my-2" />
            </WebOnlyAdSlot>

            <RecipeSlideWithErrorBoundary
              title={dict.home.popularSectionTitle}
              staticRecipes={staticPopularRecipes.content}
              locale="en"
              fetchFailed={staticPopularRecipes.fetchFailed}
              prefetch={null}
              prioritizeFirstImage
            />

            <YoutubeVerifiedServerSlide
              locale="en"
              staticRecipes={youtubeVerifiedRecipes.content}
              fetchFailed={youtubeVerifiedRecipes.fetchFailed}
              prefetch={null}
            />

            <SeasonalPopularServerSlide locale="en" prefetch={null} />

            <CountryPopularServerSlide locale="en" prefetch={null} />

            <QuickPopularServerSlide locale="en" prefetch={null} />

            <BudgetServerSlide
              title={dict.home.budgetSectionTitle}
              locale="en"
              prefetch={null}
            />

            <CategoryPopularServerSlide locale="en" prefetch={null} />
          </div>
        </Container>
        <DesktopFooter />
        <ToastDebugButton />
      </HomeAdsGate>
    </>
  );
};

export default HomePage;
