"use client";

import React, { useState } from "react";

import { InfiniteData } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import { BaseRecipesApiResponse } from "@/entities/recipe";

import { getMySavedRecipes } from "@/features/view-saved-recipes";
import {
  useYoutubeImportStoreV2,
  PendingRecipeSection,
} from "@/features/recipe-import-youtube";

import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

const MyFavoriteRecipesTabContent = () => {
  const [sort] = useState<"ASC" | "DESC">("DESC");
  const jobs = useYoutubeImportStoreV2((state) => state.jobs);
  const visibleJobKeys = Object.keys(jobs).filter((key) => {
    const job = jobs[key];
    return (
      job.state === "creating" ||
      job.state === "polling" ||
      job.state === "failed"
    );
  });

  const { data, error, hasNextPage, isFetching, ref } = useInfiniteScroll<
    BaseRecipesApiResponse,
    Error,
    InfiniteData<BaseRecipesApiResponse>,
    [string, string, "ASC" | "DESC"],
    number
  >({
    queryKey: ["recipes", "favorite", sort],
    queryFn: ({ pageParam }) =>
      getMySavedRecipes({
        sort,
        pageParam,
      }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
  });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];

  const hasVisibleJobs = visibleJobKeys.length > 0;

  return (
    <div>
      {hasVisibleJobs && (
        <ErrorBoundary
          fallback={
            <SectionErrorFallback message="추출 중인 레시피 상태를 불러올 수 없어요" />
          }
        >
          <PendingRecipeSection pendingJobKeys={visibleJobKeys} />
        </ErrorBoundary>
      )}
      <ErrorBoundary
        fallback={
          <SectionErrorFallback message="레시피 목록을 불러올 수 없어요" />
        }
      >
        <RecipeGrid
          recipes={recipes}
          isSimple={false}
          hasNextPage={hasNextPage}
          isFetching={isFetching}
          noResults={recipes.length === 0 && !isFetching && !hasVisibleJobs}
          noResultsMessage={
            recipes.length === 0
              ? "즐겨찾기한 레시피가 없습니다."
              : "즐겨찾기한 레시피를 추가해보세요."
          }
          observerRef={ref}
          error={error}
          useLCP={false}
          queryKeyToInvalidate={["recipes", "favorite", sort]}
        />
      </ErrorBoundary>
    </div>
  );
};

export default MyFavoriteRecipesTabContent;
