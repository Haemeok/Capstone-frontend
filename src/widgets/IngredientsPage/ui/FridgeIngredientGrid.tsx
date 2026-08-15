"use client";

import { LocalizedLink } from "@/shared/i18n/LocalizedLink";
import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import type { IngredientItem } from "@/entities/ingredient";

import IngredientsLoginCTA from "@/features/auth/ui/IngredientsLoginCTA";

import { FridgeIngredientCard } from "./FridgeIngredientCard";

type FridgeIngredientGridProps = {
  ingredients: IngredientItem[];
  isLoggedIn: boolean;
  isManageMode: boolean;
  selectedIds: ReadonlySet<string>;
  isPending: boolean;
  isFetchingNextPage: boolean;
  error: Error | null;
  sentinelRef: (node?: Element | null) => void;
  onToggle: (ingredient: IngredientItem) => void;
};

const FridgeGridSkeleton = () => (
  <div
    data-testid="fridge-grid-skeleton"
    className="grid grid-cols-2 gap-3 px-5 py-4 md:px-6"
  >
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="flex min-h-[74px] items-center gap-2.5 rounded-2xl border border-gray-200 p-2.5"
      >
        <Skeleton className="h-[52px] w-[52px] shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-20 max-w-full" />
        </div>
      </div>
    ))}
  </div>
);

export const FridgeIngredientGrid = ({
  ingredients,
  isLoggedIn,
  isManageMode,
  selectedIds,
  isPending,
  isFetchingNextPage,
  error,
  sentinelRef,
  onToggle,
}: FridgeIngredientGridProps) => {
  const t = useIngredientsDict();

  if (!isLoggedIn) return <IngredientsLoginCTA />;
  if (isPending) return <FridgeGridSkeleton />;

  return (
    <section aria-live="polite">
      {ingredients.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 px-5 py-4 md:px-6">
          {ingredients.map((ingredient) => (
            <FridgeIngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              isManageMode={isManageMode}
              isSelected={selectedIds.has(ingredient.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : (
        <div className="px-5 py-10 md:px-6">
          <h2 className="text-ink text-lg font-bold">{t.empty.heading}</h2>
          <p className="text-ink-sub mt-2 text-sm leading-6">
            {t.empty.bodyLine1} {t.empty.bodyLine2}
          </p>
          {!isManageMode ? (
            <LocalizedLink
              href="/ingredients/new"
              className="bg-olive-light focus-visible:ring-olive-light active:bg-olive-dark mt-5 inline-flex min-h-11 cursor-pointer items-center rounded-xl px-5 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {t.empty.cta}
            </LocalizedLink>
          ) : null}
        </div>
      )}

      {isFetchingNextPage ? <FridgeGridSkeleton /> : null}
      {error ? (
        <p
          role="alert"
          className="text-ink-sub mx-5 rounded-xl bg-gray-100 px-4 py-3 text-sm md:mx-6"
        >
          {t.error.prefix}: {error.message || t.error.unknown}
        </p>
      ) : null}
      <div ref={sentinelRef} className="h-8" aria-hidden />
    </section>
  );
};
