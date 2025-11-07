"use client";

import { InfiniteData } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";
import Circle from "@/shared/ui/Circle";
import HomeBanner from "@/shared/ui/HomeBanner";
import PrevButton from "@/shared/ui/PrevButton";

import { DetailedRecipesApiResponse, getRecipeItems } from "@/entities/recipe";

import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

const AIRecipeListPage = () => {
  const { data, hasNextPage, isFetching, ref } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    [string, string],
    number
  >({
    queryKey: ["recipes", "ai-list"],
    queryFn: ({ pageParam }) =>
      getRecipeItems({
        isAiGenerated: true,
        sort: "desc",
        pageParam,
      }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
  });

  const recipes = data?.pages.flatMap((page) => page.content);

  return (
    <div className="bg-white p-2">
      <header className="relative flex items-center justify-center border-b border-gray-200 p-2">
        <PrevButton className="absolute left-2" showOnDesktop={true} />
        <h1 className="text-xl font-bold">AI 추천 레시피</h1>
      </header>
      {!isFetching && recipes && recipes.length > 0 ? (
        <RecipeGrid
          recipes={recipes}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          observerRef={ref}
        />
      ) : (
        <div className="flex h-[500px] w-full flex-col items-center justify-center p-4">
          {isFetching ? (
            <Circle className="text-olive-mint/60" size={32} />
          ) : (
            <>
              <p className="text-mm text-gray-500">
                AI 추천 레시피가 아직 없어요 !
              </p>
              <HomeBanner
                title="AI 레시피 생성하러가기"
                description="새로운 AI 레시피를 만들어보세요!"
                image="/robot1.webp"
                to="/ai-recipe"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecipeListPage;
