"use client";

import React, { useState } from "react";

import { InfiniteData } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import { BaseRecipesApiResponse } from "@/entities/recipe";

import { getMyFavoriteItems } from "@/features/view-favorite-recipes";
import {
  useYoutubeImportStore,
  PendingRecipeCard,
} from "@/features/recipe-import-youtube";

import RecipeGrid from "@/widgets/RecipeGrid/ui/RecipeGrid";

const MyFavoriteRecipesTabContent = () => {
  const [sort] = useState<"ASC" | "DESC">("DESC");
  const imports = useYoutubeImportStore((state) => state.imports);
  const pendingImportKeys = Object.keys(imports);

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

  const hasPendingImports = pendingImportKeys.length > 0;

  return (
    <div>
      {hasPendingImports && (
        <div className="mb-6">
          <h3 className="text-olive-700 mb-3 text-sm font-semibold">
            처리 중인 레시피
          </h3>
          <div className="grid [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] gap-4 sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))] md:[grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] lg:[grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
            {pendingImportKeys.map((url) => (
              <PendingRecipeCard key={url} url={url} />
            ))}
          </div>
        </div>
      )}
      <RecipeGrid
        recipes={recipes}
        isSimple={false}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
        noResults={recipes.length === 0 && !isFetching && !hasPendingImports}
        noResultsMessage={
          recipes.length === 0
            ? "즐겨찾기한 레시피가 없습니다."
            : "즐겨찾기한 레시피를 추가해보세요."
        }
        observerRef={ref}
        error={error}
      />
    </div>
  );
};

export default MyFavoriteRecipesTabContent;
