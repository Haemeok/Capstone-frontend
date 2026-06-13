"use client";

import { useRecentlyViewedRecipes } from "@/shared/hooks/useRecentlyViewedRecipes";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";
import { triggerHaptic } from "@/shared/lib/bridge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";

const RecentlyViewedRecipes = () => {
  const { recipes, isLoaded, clearAll } = useRecentlyViewedRecipes();
  const t = useSearchDiscoveryDict();

  const validRecipes = recipes.filter(
    (recipe) => recipe.authorId && recipe.profileImage
  );

  if (!isLoaded || validRecipes.length === 0) {
    return null;
  }

  const handleClearAll = () => {
    triggerHaptic("Light");
    clearAll();
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-ink-muted text-sm font-medium">
          {t.recentViewedTitle}
        </h3>
        <button
          onClick={handleClearAll}
          className="active:text-ink-sub cursor-pointer text-sm text-gray-400"
        >
          {t.clearAction}
        </button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        className="-mx-4 px-4"
      >
        <CarouselContent className="-ml-3">
          {validRecipes.map((recipe) => (
            <CarouselItem key={recipe.id} className="basis-[180px] pl-3">
              <DetailedRecipeGridItem
                recipe={{
                  ...recipe,
                  avgRating: recipe.avgRating ?? 0,
                  ratingCount: recipe.ratingCount ?? 0,
                  createdAt: "",
                  favoriteByCurrentUser: false,
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 hidden cursor-pointer md:flex" />
        <CarouselNext className="right-0 hidden cursor-pointer md:flex" />
      </Carousel>
    </section>
  );
};

export default RecentlyViewedRecipes;
