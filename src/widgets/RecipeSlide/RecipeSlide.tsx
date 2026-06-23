"use client";

import { ReactNode } from "react";

import { ChevronRight } from "lucide-react";

import { LocalizedLink } from "@/shared/i18n";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";
import BudgetTierBadge from "@/shared/ui/badge/BudgetTierBadge";
import RemixBadge from "@/shared/ui/badge/RemixBadge";
import TimeBadge from "@/shared/ui/badge/TimeBadge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe";

import { RecipeSaveButton } from "@/features/recipe-save";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";

type RecipeSlideProps = {
  title: string;
  to?: string;
  recipes: DetailedRecipeGridItemType[];
  isLoading: boolean;
  error: Error | null;
  locale?: "ko" | "ja" | "en";
  emphasizeTime?: boolean;
};

const getRecipeRightBadge = (
  recipe: DetailedRecipeGridItemType,
  remixLabel: string
): ReactNode => {
  if (recipe.isRemix) {
    return <RemixBadge label={remixLabel} />;
  }
  if (recipe.ingredientCost) {
    return <BudgetTierBadge ingredientCost={recipe.ingredientCost} />;
  }
  return null;
};

export const RecipeSlideLoading = () => (
  <div className="flex w-full gap-3 overflow-x-auto">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex-shrink-0">
        <Skeleton className="rounded-card h-[200px] w-[200px]" />
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    ))}
  </div>
);

type InlineProps = { message: string };

const RecipeSlideError = ({ message }: InlineProps) => (
  <div className="flex h-30 w-full items-center justify-center py-8">
    <p className="text-ink-muted text-sm">{message}</p>
  </div>
);

const RecipeSlideEmpty = ({ message }: InlineProps) => (
  <div className="flex w-full items-center justify-center py-8">
    <p className="text-ink-muted text-sm">{message}</p>
  </div>
);

const RecipeSlide = ({
  title,
  to,
  recipes,
  isLoading,
  error,
  locale,
  emphasizeTime,
}: RecipeSlideProps) => {
  const t = useSearchDiscoveryDict();

  const renderContent = () => {
    if (isLoading) return <RecipeSlideLoading />;
    if (error) return <RecipeSlideError message={t.recipeSlideError} />;
    if (recipes.length === 0)
      return <RecipeSlideEmpty message={t.recipeSlideEmpty} />;

    return (
      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {recipes.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-2/5 pl-3 sm:basis-[200px]"
            >
              <DetailedRecipeGridItem
                recipe={item}
                prefetch
                hideCookingTime
                locale={locale}
                infoBadge={
                  emphasizeTime && item.cookingTime != null ? (
                    <TimeBadge minutes={item.cookingTime} />
                  ) : (
                    getRecipeRightBadge(item, t.remixBadge)
                  )
                }
                saveBadge={
                  <RecipeSaveButton
                    recipeId={item.id}
                    initialIsFavorite={item.favoriteByCurrentUser}
                    buttonClassName="text-white"
                    iconClassName="fill-gray-300 opacity-80"
                  />
                }
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden cursor-pointer md:flex" />
        <CarouselNext className="-right-4 hidden cursor-pointer md:flex" />
      </Carousel>
    );
  };

  return (
    <div className="mt-6 w-full">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-ink text-lg font-bold">{title}</h2>
        </div>
        {to && (
          <LocalizedLink
            href={to}
            className="text-ink-muted hover:text-ink-sub flex items-center text-sm"
          >
            {t.recipeSlideViewMore}
            <ChevronRight size={16} />
          </LocalizedLink>
        )}
      </div>

      {renderContent()}
    </div>
  );
};

export default RecipeSlide;
