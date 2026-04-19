"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import {
  BOOK_DETAIL_PAGE_SIZE,
  type BookRecipe,
  DEFAULT_BOOK_SORT,
  getRecipeBookDetail,
  RECIPE_BOOK_QUERY_KEYS,
  type RecipeBookDetail,
} from "@/entities/recipe-book";

import { useEditModeStore } from "@/features/recipe-book-edit-mode";

type Props = {
  bookId: string;
};

const SKELETON_COUNT = 8;

const GRID_CLASS =
  "grid grid-cols-2 gap-3 py-3 sm:gap-4 sm:py-4 md:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]";

const RecipeBookGridItem = ({ recipe }: { recipe: BookRecipe }) => (
  <div className="group relative block overflow-hidden rounded-xl">
    <Image
      src={recipe.imageUrl}
      alt={recipe.title}
      wrapperClassName="overflow-hidden rounded-xl"
      imgClassName="transition-all duration-300 ease-in-out group-hover:scale-110"
      fit="cover"
    />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 rounded-b-xl bg-gradient-to-t from-black/70 to-transparent" />
    <p className="word-break absolute right-3 bottom-2 left-3 line-clamp-2 text-[15px] leading-tight text-pretty text-white">
      {recipe.title}
    </p>
    <Link
      href={`/recipes/${recipe.recipeId}`}
      aria-label={recipe.title}
      className="absolute inset-0 rounded-xl"
    />
  </div>
);

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
  <div className={GRID_CLASS}>
    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
      <Skeleton key={i} className="aspect-[4/5] w-full rounded-xl" />
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

export const RecipeBookRecipeGrid = ({ bookId }: Props) => {
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
        size: BOOK_DETAIL_PAGE_SIZE,
        sort: DEFAULT_BOOK_SORT,
      }),
    getNextPageParam: (last, all) => (last.hasNext ? all.length : undefined),
    initialPageParam: 0,
    initialData: previewData
      ? { pages: [previewData], pageParams: [0] }
      : undefined,
  });

  const recipes = data?.pages.flatMap((p) => p.recipes) ?? [];

  if (isPending && recipes.length === 0) return <GridSkeleton />;
  if (!isFetching && recipes.length === 0) return <EmptyState />;

  return (
    <div className={isEditMode ? "pb-24" : ""}>
      <div className={GRID_CLASS}>
        {recipes.map((recipe) => (
          <div key={recipe.recipeId} className="relative">
            <RecipeBookGridItem recipe={recipe} />
            {isEditMode && <SelectionOverlay recipeId={recipe.recipeId} />}
          </div>
        ))}
      </div>
      {hasNextPage && <div ref={ref} className="h-10" aria-hidden />}
    </div>
  );
};
