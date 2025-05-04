import RecipeGrid from '@/components/recipeGrid/RecipeGrid';
import DetailedRecipeGridItem from '@/components/recipeGrid/DetailedRecipeGridItem';
import { createdRecipes } from '@/mock';
import { ChevronRight } from 'lucide-react';
import React from 'react';

const RecipeSlide = () => {
  return (
    <div className="mt-8 w-full p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-800">추천 레시피</h2>
        </div>
        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          더보기
          <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>
      <div className="scrollbar-hide flex w-full gap-3 overflow-x-auto">
        {createdRecipes.map((item) => (
          <div key={item.id} className="w-42 flex-shrink-0 rounded-2xl">
            <DetailedRecipeGridItem recipe={item} height={200} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeSlide;
