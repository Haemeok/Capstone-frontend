import RecipeGrid from '@/components/recipeGrid/RecipeGrid';
import DetailedRecipeGridItem from '@/components/recipeGrid/DetailedRecipeGridItem';
import { createdRecipes } from '@/mock';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import { BaseRecipeGridItem } from '@/type/recipe';
import { DetailedRecipeGridItem as DetailedRecipeGridItemType } from '@/type/recipe';

type RecipeSlideProps = {
  title: string;
  recipes: BaseRecipeGridItem[] | DetailedRecipeGridItemType[];
};

const RecipeSlide = ({ title, recipes }: RecipeSlideProps) => {
  return (
    <div className="mt-2 w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          더보기
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="scrollbar-hide flex w-full gap-3 overflow-x-auto">
        {createdRecipes.map((item) => (
          <DetailedRecipeGridItem recipe={item} height={200} />
        ))}
      </div>
    </div>
  );
};

export default RecipeSlide;
