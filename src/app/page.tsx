import { homeMetadata } from "@/shared/lib/metadata";
import { Container } from "@/shared/ui/Container";

import { getStaticRecipesOnServer } from "@/entities/recipe/model/api.server";

import CategoryTabs from "@/widgets/CategoryTabs";
import DesktopFooter from "@/widgets/Footer/DesktopFooter";
import HomeHeader from "@/widgets/Header/HomeHeader";
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
