"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import {
  type BookRecipe,
  DEFAULT_BOOK_SORT,
  getRecipeBookDetail,
  RECIPE_BOOK_QUERY_KEYS,
  type RecipeBookDetail,
} from "@/entities/recipe-book";
import type { BaseRecipeGridItem } from "@/entities/recipe/model/types";

import { useEditModeStore } from "@/features/recipe-book-edit-mode";

import SimpleRecipeGridItem from "@/widgets/RecipeGrid/ui/SimpleRecipeGridItem";

type Props = {
  bookId: string;
  onAllIdsChange: (ids: string[]) => void;
};

const PAGE_SIZE = 20;
const SKELETON_COUNT = 8;

const noopOpenDrawer = () => {};

const EmptyState = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 text-5xl" aria-hidden>
        🍳
      </div>
      <p className="mb-6 text-base text-gray-500">
        아직 저장한 레시피가 없어요
      </p>
      <button
        type="button"
        onClick={() => router.push("/search/results")}
        className="bg-olive-light rounded-xl px-5 py-3 text-sm font-bold text-white transition-all active:scale-[0.98]"
      >
        레시피 둘러보기 →
      </button>
    </div>
  );
};

const GridSkeleton = () => (
  <div className="grid gap-4 p-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
      <div key={i}>
        <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
        <Skeleton className="mt-2 h-5 w-3/4 rounded" />
      </div>
    ))}
  </div>
);

const SelectionOverlay = ({ recipeId }: { recipeId: string }) => {
  const isSelected = useEditModeStore((s) => s.selectedIds.has(recipeId));
  const toggle = useEditModeStore((s) => s.toggle);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(recipeId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute inset-0 z-10"
      aria-label={isSelected ? "선택 해제" : "선택"}
    >
      <span
        className={cn(
          "absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
          isSelected
            ? "border-olive-light bg-olive-light"
            : "border-white bg-white/80"
        )}
      >
        {isSelected && <CheckIcon size={14} className="text-white" />}
      </span>
    </button>
  );
};

/**
 * Map BookRecipe → BaseRecipeGridItem.
 *
 * BookRecipe (from recipe-book API) only includes:
 *   recipeId, title, imageUrl, dishType, addedAt
 *
 * BaseRecipeGridItem additionally requires author info, like state, and
 * profileImage. Since the recipe-book endpoint does not return these,
 * we use safe defaults:
 *   - authorName / authorId / profileImage: empty strings (not displayed
 *     by SimpleRecipeGridItem; it only shows title + like button)
 *   - createdAt: addedAt as proxy
 *   - likeCount: 0 / likedByCurrentUser: false (RecipeLikeButton will
 *     hydrate real state via its own query if needed)
 */
const toBaseRecipe = (r: BookRecipe): BaseRecipeGridItem => ({
  id: r.recipeId,
  title: r.title,
  imageUrl: r.imageUrl,
  authorName: "",
  authorId: "",
  profileImage: "",
  createdAt: r.addedAt,
  likeCount: 0,
  likedByCurrentUser: false,
  favoriteByCurrentUser: false,
});

export const RecipeBookRecipeGrid = ({ bookId, onAllIdsChange }: Props) => {
  const queryClient = useQueryClient();
  const isEditMode = useEditModeStore((s) => s.isEditMode);

  const previewKey = RECIPE_BOOK_QUERY_KEYS.detail(bookId, DEFAULT_BOOK_SORT);
  const previewData = queryClient.getQueryData<RecipeBookDetail>(previewKey);

  const { data, isPending, hasNextPage, isFetching, ref } = useInfiniteScroll<
    RecipeBookDetail,
    Error,
    InfiniteData<RecipeBookDetail>,
    readonly unknown[],
    number
  >({
    queryKey: RECIPE_BOOK_QUERY_KEYS.detailInfinite(bookId, DEFAULT_BOOK_SORT),
    queryFn: ({ pageParam }) =>
      getRecipeBookDetail(bookId, {
        page: pageParam,
        size: PAGE_SIZE,
        sort: DEFAULT_BOOK_SORT,
      }),
    getNextPageParam: (last, all) => (last.hasNext ? all.length : undefined),
    initialPageParam: 0,
    initialData: previewData
      ? { pages: [previewData], pageParams: [0] }
      : undefined,
  });

  const recipes = data?.pages.flatMap((p) => p.recipes) ?? [];
  const mappedRecipes = recipes.map(toBaseRecipe);

  const lastIdsKeyRef = useRef("");

  useEffect(() => {
    const ids =
      data?.pages.flatMap((p) => p.recipes.map((r) => r.recipeId)) ?? [];
    const key = ids.join(",");
    if (key === lastIdsKeyRef.current) return;
    lastIdsKeyRef.current = key;
    onAllIdsChange(ids);
  }, [data, onAllIdsChange]);

  if (isPending && recipes.length === 0) return <GridSkeleton />;
  if (!isFetching && recipes.length === 0) return <EmptyState />;

  return (
    <div className={isEditMode ? "pb-24" : ""}>
      <div className="grid gap-4 p-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        {mappedRecipes.map((recipe) => (
          <div key={recipe.id} className="relative">
            <SimpleRecipeGridItem
              recipe={recipe}
              setIsDrawerOpen={noopOpenDrawer}
              prefetch={false}
            />
            {isEditMode && <SelectionOverlay recipeId={recipe.id} />}
          </div>
        ))}
      </div>
      {hasNextPage && <div ref={ref} className="h-10" aria-hidden />}
    </div>
  );
};
