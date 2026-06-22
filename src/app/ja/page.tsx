import { Suspense } from "react";

import { HomeAnchorAdSlot, HomeHeaderAnchorAdSlot } from "@/shared/adsense";
import { getDictionary } from "@/shared/i18n";
import { buildHomeMetadata } from "@/shared/lib/metadata";
import { createWebsiteStructuredData } from "@/shared/lib/metadata/structuredData";
import { Container } from "@/shared/ui/Container";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import { getStaticRecipesOnServer } from "@/entities/recipe/model/api.server";

import CategoryTabs from "@/widgets/CategoryTabs";
import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import HomeHeader from "@/widgets/Header/HomeHeader";
import HomeBannerCarousel from "@/widgets/HomeBannerCarousel";
import { selectHomeBannerSlides } from "@/widgets/HomeBannerCarousel/selectSlides";
import RecipeSlideWithErrorBoundary from "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary";
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

  const jsonLd = createWebsiteStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
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
            <HomeBannerCarousel slides={slides} />
          </ErrorBoundary>

          <HomeAnchorAdSlot className="my-2" />

          <RecipeSlideWithErrorBoundary
            title={dict.home.popularSectionTitle}
            queryKey="popular-recipes"
            period="weekly"
            isStatic
            staticRecipes={staticPopularRecipes.content}
            locale="ja"
          />

          <RecipeSlideWithErrorBoundary
            title={dict.home.budgetSectionTitle}
            queryKey="budget-recipes"
            maxCost={10000}
            isStatic
            staticRecipes={staticBudgetRecipes.content}
            locale="ja"
          />
        </div>
      </Container>
      <DesktopFooter />
      <ToastDebugButton />
    </>
  );
};

export default HomePage;
