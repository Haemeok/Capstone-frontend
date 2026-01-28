"use client";

import { useRecentlyViewedRecipes } from "@/shared/hooks/useRecentlyViewedRecipes";
import { triggerHaptic } from "@/shared/lib/bridge";

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

      <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4">
        {validRecipes.map((recipe) => (
          <div key={recipe.id} className="w-[180px] shrink-0">
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewedRecipes;
