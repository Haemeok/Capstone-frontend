"use client";

import { CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import {
  getRecipeBookDetail,
  RECIPE_BOOK_QUERY_KEYS,
  type BookRecipe,
  type RecipeBookDetail,
} from "@/entities/recipe-book";

import { useEditModeStore } from "@/features/recipe-book-edit-mode";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

type Props = {
  bookId: string;
  onAllIdsChange: (ids: string[]) => void;
};

const SORT = "addedAt,desc";
const PAGE_SIZE = 20;
const SKELETON_COUNT = 8;

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
        onClick={() => router.push("/search/result")}
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

const RecipeItem = ({ recipe }: { recipe: BookRecipe }) => {
  const isEditMode = useEditModeStore((s) => s.isEditMode);
  const isSelected = useEditModeStore((s) =>
    s.selectedIds.has(recipe.recipeId)
  );
  const toggle = useEditModeStore((s) => s.toggle);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      toggle(recipe.recipeId);
    }
  };

  return (
    <Link
      href={`/recipes/${recipe.recipeId}`}
      onClick={handleClick}
      className="group relative block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover"
        />
        {isEditMode && (
          <div
            className={cn(
              "absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
              isSelected
                ? "border-olive-light bg-olive-light"
                : "border-white bg-white/80"
            )}
          >
            {isSelected && <CheckIcon size={14} className="text-white" />}
          </div>
        )}
      </div>
      <p className="mt-2 truncate px-1 text-sm font-medium text-gray-900">
        {recipe.title}
      </p>
    </Link>
  );
};

export const RecipeBookRecipeGrid = ({ bookId, onAllIdsChange }: Props) => {
  const queryClient = useQueryClient();
  const isEditMode = useEditModeStore((s) => s.isEditMode);

  const previewKey = RECIPE_BOOK_QUERY_KEYS.detail(bookId, SORT);
  const previewData = queryClient.getQueryData<RecipeBookDetail>(previewKey);

  const { data, isPending, hasNextPage, isFetching, ref } = useInfiniteScroll<
    RecipeBookDetail,
    Error,
    InfiniteData<RecipeBookDetail>,
    readonly unknown[],
    number
  >({
    queryKey: RECIPE_BOOK_QUERY_KEYS.detailInfinite(bookId, SORT),
    queryFn: ({ pageParam }) =>
      getRecipeBookDetail(bookId, {
        page: pageParam,
        size: PAGE_SIZE,
        sort: SORT,
      }),
    getNextPageParam: (last, all) => (last.hasNext ? all.length : undefined),
    initialPageParam: 0,
    initialData: previewData
      ? { pages: [previewData], pageParams: [0] }
      : undefined,
  });

  const recipes = data?.pages.flatMap((p) => p.recipes) ?? [];

  useEffect(() => {
    onAllIdsChange(recipes.map((r) => r.recipeId));
  }, [recipes, onAllIdsChange]);

  if (isPending && recipes.length === 0) return <GridSkeleton />;
  if (!isFetching && recipes.length === 0) return <EmptyState />;

  return (
    <div className={isEditMode ? "pb-24" : ""}>
      <div className="grid gap-4 p-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        {recipes.map((recipe) => (
          <RecipeItem key={recipe.recipeId} recipe={recipe} />
        ))}
      </div>
      {hasNextPage && <div ref={ref} className="h-10" aria-hidden />}
    </div>
  );
};
