import Link from "next/link";

import { homeMetadata } from "@/shared/lib/metadata";
import { Container } from "@/shared/ui/Container";

import { getStaticRecipesOnServer } from "@/entities/recipe/model/api.server";

import CategoryTabs from "@/widgets/CategoryTabs";
import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import HomeHeader from "@/widgets/Header/HomeHeader";
import RecipeSlideWithErrorBoundary from "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary";
import HomeBannerCarousel from "@/widgets/HomeBannerCarousel";

import { aiModelBanners } from "@/shared/config/constants/aiModel";

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

  return (
    <>
      <Container>
        <div className="flex flex-col items-center justify-center gap-4 bg-white text-gray-800">
          <HomeHeader />
          <Link
            href="/archetype"
            className="group relative block w-full overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source
                src="https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/videos/landingVideo.webm"
                type="video/webm"
              />
            </video>
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex h-24 flex-col items-center justify-center space-y-4 px-6 py-8 md:h-40 md:space-y-6">
              <div className="space-y-2 text-center md:space-y-3">
                <h1 className="flex flex-col font-serif text-3xl leading-tight font-light tracking-wide text-white md:text-5xl">
                  <div className="text-3xl font-semibold md:text-6xl">
                    FIND DINING
                  </div>
                  <div className="text-xl font-semibold md:text-2xl">
                    PERSONA
                  </div>
                </h1>
                <p className="hidden text-sm text-white/70 md:block md:text-base">
                  나를 파인다이닝 디쉬로 표현해보세요. 테스트 시간 1분
                </p>
              </div>
            </div>
          </Link>
          <CategoryTabs title="카테고리" />

          <RecipeSlideWithErrorBoundary
            title="만원 이하 가성비 레시피"
            queryKey="budget-recipes"
            maxCost={10000}
            isStatic
            staticRecipes={staticBudgetRecipes.content}
          />

          <RecipeSlideWithErrorBoundary
            title="주간 인기 레시피"
            queryKey="popular-recipes"
            period="weekly"
            isStatic
            staticRecipes={staticPopularRecipes.content}
          />
        </div>
      </Container>
      <DesktopFooter />
    </>
  );
};

export default HomePage;
