import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { homeMetadata } from "@/shared/lib/metadata";
import { Container } from "@/shared/ui/Container";
import HomeBanner from "@/shared/ui/HomeBanner";

import {
  getRecipesOnServer,
  getStaticRecipesOnServer,
} from "@/entities/recipe/model/api.server";

import CategoryTabs from "@/widgets/CategoryTabs";
import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import HomeHeader from "@/widgets/Header/HomeHeader";
import { OnboardingSurveyModal } from "@/widgets/OnboardingSurveryModal";
import RecipeSlideWithErrorBoundary from "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary";

export const metadata = homeMetadata;

const HomePage = async () => {
  const queryClient = new QueryClient();

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

  console.log(staticBudgetRecipes);

  return (
    <>
      <Container>
        <div className="flex flex-col items-center justify-center gap-4 bg-white text-gray-800">
          <HomeHeader />
          <CategoryTabs title="카테고리" />
          <HomeBanner
            title="AI 레시피 생성하기"
            description="AI로 나만의 특색있는 레시피를 만들어보세요!"
            image="/robot1.webp"
            to="/recipes/new/ai"
          />

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
