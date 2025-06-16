import React, { useRef } from 'react';
import { AIRecommendedRecipe, Recipe } from '@/type/recipe';
import SuspenseImage from '@/components/Image/SuspenseImage';
import Box from '@/components/ui/Box';
import RequiredAmountDisplay from '../RequiredAmountDisplay';
import { formatPrice } from '@/utils/recipe';
import RecipeStepList from '@/components/RecipeStepList';
import useScrollAnimate from '@/hooks/useScrollAnimate';
import CollapsibleP from '@/components/CollapsibleP';
import { m } from '@/mock';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

type AIRecipeDisplayProps = {
  createdRecipe: Recipe;
};

const AIRecipeDisplay = ({ createdRecipe }: AIRecipeDisplayProps) => {
  const recipe = m;
  const observerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { targetRef: cookButtonRef } = useScrollAnimate<HTMLButtonElement>({
    triggerRef: observerRef,
    start: 'top bottom-=100px',
    toggleActions: 'play none none reset',
    yOffset: 10,
    duration: 0.2,
    delay: 0,
  });
  return (
    <div>
      <div>
        <SuspenseImage
          src={recipe.imageUrl ?? ''}
          alt={recipe.title}
          className="h-112 w-full object-cover"
        />
        <h1 className="mt-4 text-center text-2xl font-bold">{recipe.title}</h1>
        <Box>
          <CollapsibleP content={recipe.description} />
        </Box>
      </div>
      <Box className="flex flex-col gap-2">
        <h2 className="mb-2 text-xl font-semibold">재료</h2>
        <RequiredAmountDisplay
          pointText={formatPrice(recipe.totalIngredientCost)}
          prefix="이 레시피에 약"
          suffix="필요해요!"
        />
        <ul className="flex flex-col gap-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="grid grid-cols-3 gap-4">
              <p className="text-left font-bold">{ingredient.name}</p>
              <p className="text-left">
                {ingredient.quantity}
                {ingredient.unit}
              </p>
              <p className="text-left text-sm text-slate-500">
                {formatPrice(ingredient.price)}원
              </p>
            </li>
          ))}
        </ul>
        <RequiredAmountDisplay
          pointText={formatPrice(
            recipe.marketPrice - recipe.totalIngredientCost,
          )}
          prefix="배달 물가 대비"
          suffix="절약해요!"
          containerClassName="mt-2 flex items-center border-0 text-gray-400 p-0 font-semibold"
          textClassName="text-purple-500"
        />
      </Box>
      <Box>
        <RecipeStepList RecipeSteps={recipe.steps} />
      </Box>
      <div className="fixed bottom-20 z-50 flex w-full justify-center">
        <Button
          ref={cookButtonRef}
          className="bg-olive-light rounded-full p-4 text-white shadow-lg"
          onClick={() => navigate(`/recipes/${createdRecipe?.id}/slideShow`)}
        >
          요리하기
        </Button>
      </div>
    </div>
  );
};

export default AIRecipeDisplay;
