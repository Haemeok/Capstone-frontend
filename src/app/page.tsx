import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { homeMetadata } from "@/shared/lib/metadata";
import HomeBanner from "@/shared/ui/HomeBanner";

import { getRecipesOnServer } from "@/entities/recipe/model/api.server";

import CategoryTabs from "@/widgets/CategoryTabs";
import HomeHeader from "@/widgets/Header/HomeHeader";
import { OnboardingSurveyModal } from "@/widgets/OnboardingSurveryModal";
import RecipeSlideWithErrorBoundary from "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary";

export const metadata = homeMetadata;

const HomePage = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["ai-recipes"],
      queryFn: () =>
        getRecipesOnServer({
          isAiGenerated: true,
          sort: "desc",
          key: "ai-recipes",
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["party-recipes"],
      queryFn: () =>
        getRecipesOnServer({
          tagNames: ["HOME_PARTY"],
          sort: "desc",
          key: "party-recipes",
        }),
    }),
  ]);

  console.log("dehydrate", dehydrate(queryClient));
  console.log("queryClient", queryClient.getQueryData(["ai-recipes"]));

  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-white p-4 text-gray-800">
      <HomeHeader />
      <CategoryTabs title="카테고리" />
      <HomeBanner
        title="AI 레시피 생성하기"
        description="AI로 나만의 특색있는 레시피를 만들어보세요!"
        image="/robot1.png"
        to="/recipes/new/ai"
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RecipeSlideWithErrorBoundary
          title="AI가 추천하는 레시피"
          queryKey="ai-recipes"
          isAiGenerated={true}
          to="/recipes/ai"
        />

        <RecipeSlideWithErrorBoundary
          title="홈파티 레시피"
          queryKey="party-recipes"
          tagNames={["HOME_PARTY"]}
          to="/recipes/category/HOME_PARTY"
        />
      </HydrationBoundary>
      <OnboardingSurveyModal />
    </div>
  );
};

export default HomePage;
