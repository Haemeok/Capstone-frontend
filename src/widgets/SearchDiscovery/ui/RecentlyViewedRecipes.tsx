"use client";

import { useRecentlyViewedRecipes } from "@/shared/hooks/useRecentlyViewedRecipes";
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

  // Filter out incomplete recipes (old data without required fields)
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
        <h3 className="text-sm font-medium text-gray-500">최근 본 레시피</h3>
        <button
          onClick={handleClearAll}
          className="cursor-pointer text-sm text-gray-400 active:text-gray-600"
        >
          지우기
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
                  likeCount: 0,
                  likedByCurrentUser: false,
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
