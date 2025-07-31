import HomeBanner from "@/shared/ui/HomeBanner";
import { homeMetadata } from "@/shared/lib/metadata";

import { getRecipesOnServer } from "@/entities/recipe/model/api.server";

import CategoryTabs from "@/widgets/CategoryTabs";
import HomeHeader from "@/widgets/Header/HomeHeader";
import { OnboardingSurveyModal } from "@/widgets/OnboardingSurveryModal";
import RecipeSlideWithErrorBoundary from "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary";

export const metadata = homeMetadata;

const HomePage = async () => {
  const [aiRecipes, partyRecipes] = await Promise.all([
    getRecipesOnServer({
      key: "ai-recipes",
      isAiGenerated: true,
      sort: "desc",
    }),
    getRecipesOnServer({
      key: "party-recipes",
      tagNames: ["HOME_PARTY"],
      sort: "desc",
    }),
  ]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-white p-4 text-gray-800">
      <HomeHeader />
      <CategoryTabs title="카테고리" />
      <HomeBanner
        title="AI 레시피 생성하기"
        description="AI가 추천하는 레시피를 확인해보세요!"
        image="/robot1.png"
        to="/ai-recipe"
      />

      <RecipeSlideWithErrorBoundary
        title="AI가 추천하는 레시피"
        queryKey="ai-recipes"
        isAiGenerated={true}
        to="/ai-recipes"
        initialData={aiRecipes}
      />

      <RecipeSlideWithErrorBoundary
        title="홈파티 레시피"
        queryKey="party-recipes"
        tagNames={["HOME_PARTY"]}
        to="/recipes/category/HOME_PARTY"
        initialData={partyRecipes}
      />

      <OnboardingSurveyModal />
    </div>
  );
};

export default HomePage;
