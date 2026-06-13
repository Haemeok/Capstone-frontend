"use client";

import { useUserPagesDict } from "@/shared/i18n";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { MAX_RECIPE_BOOKS, useRecipeBooks } from "@/entities/recipe-book";

import { CreateRecipeBookCard } from "./CreateRecipeBookCard";
import { RecipeBookCard } from "./RecipeBookCard";

const GRID_CLASS =
  "grid gap-4 p-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]";

const SKELETON_COUNT = 5;

const GridSkeleton = () => (
  <div className={GRID_CLASS}>
    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
      <div key={i}>
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <Skeleton className="mt-2 h-5 w-2/3 rounded" />
        <Skeleton className="mt-1 h-4 w-1/2 rounded" />
      </div>
    ))}
  </div>
);

export const RecipeBookGrid = () => {
  const t = useUserPagesDict().recipeBooks;
  const { data: books, isLoading, error } = useRecipeBooks();

  if (isLoading) return <GridSkeleton />;

  if (error) {
    return <SectionErrorFallback message={t.listLoadError} />;
  }

  const list = books ?? [];
  const showCreateCard = list.length < MAX_RECIPE_BOOKS;

  return (
    <ErrorBoundary
      fallback={<SectionErrorFallback message={t.boundaryError} />}
    >
      <div className={GRID_CLASS}>
        {list.map((book, index) => (
          <RecipeBookCard
            key={book.id}
            bookId={book.id}
            name={book.name}
            recipeCount={book.recipeCount}
            isDefault={book.isDefault}
            isFirstCard={index === 0}
          />
        ))}
        {showCreateCard && <CreateRecipeBookCard />}
      </div>
    </ErrorBoundary>
  );
};
