import { homeMetadata } from "@/shared/lib/metadata";
import { createWebsiteStructuredData } from "@/shared/lib/metadata/structuredData";
import { Container } from "@/shared/ui/Container";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import { getStaticRecipesOnServer } from "@/entities/recipe/model/api.server";

import CategoryTabs from "@/widgets/CategoryTabs";
import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import HomeHeader from "@/widgets/Header/HomeHeader";
import RecipeSlideWithErrorBoundary from "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary";
import HomeBannerCarousel from "@/widgets/HomeBannerCarousel";
import { ICON_BASE_URL } from "@/shared/config/constants/recipe";

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
      <Container>
        <div className="flex flex-col items-center justify-center gap-4 bg-white text-gray-800">
          <HomeHeader />

          <CategoryTabs title="카테고리" />

          <ErrorBoundary
            fallback={<SectionErrorFallback message="배너를 불러올 수 없어요" />}
          >
            <HomeBannerCarousel
              slides={[
                {
                  id: "youtube",
                  title: "유튜브 링크만으로\n레시피를 등록하세요",
                  ctaText: "유튜브 레시피 바로 추출하기",
                  link: "/recipes/new/youtube",
                  backgroundColor: "#f87171",
                  backgroundImage: "/gold.png",
                  mainImage: `${ICON_BASE_URL}youtube.webp`,
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
    </>
  );
};

export default HomePage;
