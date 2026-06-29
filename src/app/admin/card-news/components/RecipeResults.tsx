"use client";

import { useEffect, useRef } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getNextSlicePageParam } from "@/shared/lib/utils";

import { getRecipeItems } from "@/entities/recipe/model/api";
import { RecipeQueryParams } from "@/entities/recipe/model/types";

type RecipeResultsProps = {
  filter: Record<string, unknown>;
  thumbnailId: string | null;
  cardIds: Set<string>;
  onSelectThumbnail: (id: string) => void;
  onToggleCard: (id: string) => void;
};

export const RecipeResults = ({
  filter,
  thumbnailId,
  cardIds,
  onSelectThumbnail,
  onToggleCard,
}: RecipeResultsProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["admin-card-news", "recipes", filter],
      queryFn: ({ pageParam }) =>
        getRecipeItems({
          ...filter,
          sort: "likeCount,desc",
          page: pageParam,
          size: 20,
        } as RecipeQueryParams),
      initialPageParam: 0,
      getNextPageParam: getNextSlicePageParam,
    });

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const recipes = data?.pages.flatMap((p) => p.content) ?? [];

  if (isLoading) {
    return (
      <div className="py-12 text-center text-gray-400">레시피 검색 중...</div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="h-[600px] overflow-y-auto rounded-2xl border border-gray-100 p-3">
      <div className="grid grid-cols-4 gap-3">
        {recipes.map((recipe) => {
          const isThumbnail = thumbnailId === recipe.id;
          const isCard = cardIds.has(recipe.id);
          return (
            <div
              key={recipe.id}
              className={`rounded-card relative overflow-hidden border-2 transition-all ${
                isThumbnail
                  ? "border-blue-500 shadow-lg"
                  : isCard
                    ? "border-olive-light shadow-md"
                    : "border-transparent hover:border-gray-200"
              }`}
            >
              <div className="relative aspect-[4/5]">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="h-full w-full object-cover"
                />
                {isThumbnail && (
                  <div className="absolute top-2 left-2 rounded-lg bg-blue-500 px-2 py-1 text-xs font-bold text-white">
                    썸네일
                  </div>
                )}
                {isCard && !isThumbnail && (
                  <div className="bg-olive-light absolute top-2 left-2 rounded-lg px-2 py-1 text-xs font-bold text-white">
                    카드
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-sm font-medium text-gray-900">
                  {recipe.title}
                </p>
              </div>
              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => onSelectThumbnail(recipe.id)}
                  className={`flex-1 cursor-pointer py-1.5 text-xs font-medium ${
                    isThumbnail
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  썸네일
                </button>
                <button
                  onClick={() => onToggleCard(recipe.id)}
                  className={`flex-1 cursor-pointer border-l border-gray-100 py-1.5 text-xs font-medium ${
                    isCard
                      ? "bg-olive-light/10 text-olive-light"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  카드
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div ref={sentinelRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="py-4 text-center text-sm text-gray-400">
          불러오는 중...
        </div>
      )}
    </div>
  );
};
