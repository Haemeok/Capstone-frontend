import Link from "next/link";

import { homeMetadata } from "@/shared/lib/metadata";
import { Container } from "@/shared/ui/Container";

import { getStaticRecipesOnServer } from "@/entities/recipe/model/api.server";

import CategoryTabs from "@/widgets/CategoryTabs";
import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import HomeHeader from "@/widgets/Header/HomeHeader";
import { OnboardingSurveyModal } from "@/widgets/OnboardingSurveryModal";
import RecipeSlideWithErrorBoundary from "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary";

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
              <source src="/arche/video.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex flex-col items-center justify-center space-y-4 px-6 py-8 md:h-60 md:space-y-6">
              <div className="space-y-2 text-center md:space-y-3">
                <h1 className="font-serif text-3xl leading-tight font-light tracking-wide text-white md:text-5xl">
                  <div className="text-4xl font-semibold md:text-6xl">
                    FINE DINING
                  </div>
                  <div className="text-xl md:text-2xl">PERSONA</div>
                </h1>
              </div>
              <div className="space-y-1 text-center md:space-y-2">
                <p className="text-base font-light text-white/90 md:text-xl">
                  나를 파인다이닝 디쉬로 표현해보세요
                </p>
                <p className="text-xs font-light text-white/70 md:text-sm">
                  5가지 질문으로 알아보는 나만의 식사 스타일 · 소요시간 1분
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
          <OnboardingSurveyModal />
        </div>
      </Container>
      <DesktopFooter />
    </>
  );
};

export default HomePage;
