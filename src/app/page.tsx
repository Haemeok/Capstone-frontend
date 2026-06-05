import { Suspense } from "react";

import { HomeAnchorAdSlot } from "@/shared/adsense";
import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import { homeMetadata } from "@/shared/lib/metadata";
import { createWebsiteStructuredData } from "@/shared/lib/metadata/structuredData";
import { Container } from "@/shared/ui/Container";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import { getStaticRecipesOnServer } from "@/entities/recipe/model/api.server";

import CategoryTabs from "@/widgets/CategoryTabs";
import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import HomeHeader from "@/widgets/Header/HomeHeader";
import HomeBannerCarousel from "@/widgets/HomeBannerCarousel";
import RecipeSlideWithErrorBoundary from "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary";
import { ToastDebugButton } from "@/widgets/ToastDebugPanel";

export const metadata = homeMetadata;

const HomePage = async () => {
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
        <div className="flex flex-col items-center justify-center bg-white text-gray-800">
          <HomeAnchorAdSlot className="mb-2" />

          <CategoryTabs title="카테고리" />

          <ErrorBoundary
            fallback={
              <SectionErrorFallback message="배너를 불러올 수 없어요" />
            }
          >
            <HomeBannerCarousel
              slides={[
                {
                  id: "youtube",
                  chip: "#유튜브 레시피",
                  title: "링크만 붙여넣으면 레시피 완성",
                  ctaText: "링크로 레시피 만들기",
                  link: "/recipes/new/youtube",
                  backgroundColor: "#f87171",
                  mainImage: `${ICON_BASE_URL}youtube.webp`,
                },
                {
                  id: "world-recipes",
                  chip: "#전 세계 레시피",
                  title: "세계 각국 레시피 구경하기",
                  ctaText: "나라별 레시피 보러 가기",
                  link: "/events/world-recipes",
                  backgroundColor: "#3b82f6",
                  mainImage: "/events/world-recipes/hero.png",
                },
                {
                  id: "ad-free-june",
                  chip: "#광고 없는 6월",
                  title: "친구 초대하면 광고가 사라져요",
                  ctaText: "친구 초대하고 광고 끄기",
                  link: "/events/ad-free-june",
                  backgroundColor: "#8b5cf6",
                  mainImage: "/events/ad-free-june/hero.png",
                },
              ]}
            />
          </ErrorBoundary>

          <RecipeSlideWithErrorBoundary
            title="주간 인기 레시피"
            queryKey="popular-recipes"
            period="weekly"
            isStatic
            staticRecipes={staticPopularRecipes.content}
          />

          <RecipeSlideWithErrorBoundary
            title="만원 이하 가성비 레시피"
            queryKey="budget-recipes"
            maxCost={10000}
            isStatic
            staticRecipes={staticBudgetRecipes.content}
          />
        </div>
      </Container>
      <DesktopFooter />
      <ToastDebugButton />
    </>
  );
};

export default HomePage;
