"use client";

import React, { useRef } from "react";
import Image from "next/image";

import { formatNumber } from "@/shared/lib/format";
import CollapsibleP from "@/shared/ui/CollapsibleP";
import { FabButton } from "@/shared/ui/FabButton";
import RequiredAmountDisplay from "@/shared/ui/PointDisplayBanner";
import Box from "@/shared/ui/primitives/Box";

import { Recipe } from "@/entities/recipe";
import RecipeStepList from "@/entities/recipe/ui/RecipeStepList";

type AIRecipeDisplayProps = {
  createdRecipe: Recipe;
};

const AIRecipeDisplay = ({ createdRecipe }: AIRecipeDisplayProps) => {
  const recipe = createdRecipe;
  const observerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div>
        <Image
          src={recipe.imageUrl ?? ""}
          alt={recipe.title}
          className="h-112 w-full object-cover"
        />
        <h1 className="mt-4 text-center text-2xl font-bold">{recipe.title}</h1>

        <CollapsibleP content={recipe.description} />
      </div>
      <Box className="flex flex-col gap-2">
        <h2 className="mb-2 text-xl font-bold">재료</h2>
        <RequiredAmountDisplay
          pointText={formatNumber(recipe.totalIngredientCost)}
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
                {formatNumber(ingredient.price)}원
              </p>
            </li>
          ))}
        </ul>
        <RequiredAmountDisplay
          pointText={formatNumber(
            recipe.marketPrice - recipe.totalIngredientCost
          )}
          prefix="배달 물가 대비"
          suffix="절약해요!"
          containerClassName="flex items-center border-0 text-gray-400 p-0 font-bold"
          textClassName="text-purple-500"
        />
      </Box>
      <div ref={observerRef} className="h-1 w-full" />
      <Box>
        <RecipeStepList RecipeSteps={recipe.steps} />
      </Box>
      <FabButton
        to={`/recipes/${createdRecipe?.id}/slideShow`}
        text="요리하기"
        triggerRef={observerRef}
      />
    </div>
  );
};

export default AIRecipeDisplay;
