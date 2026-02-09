"use client";

import React, { useState } from "react";

import { InfiniteData } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import { BaseRecipesApiResponse } from "@/entities/recipe";

import { getMyFavoriteItems } from "@/features/view-favorite-recipes";
import {
  useYoutubeImportStoreV2,
  PendingRecipeSectionV2,
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
      getMyFavoriteItems({
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
        <PendingRecipeSectionV2 pendingJobKeys={visibleJobKeys} />
      )}
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
    </div>
  );
};

export default MyFavoriteRecipesTabContent;
