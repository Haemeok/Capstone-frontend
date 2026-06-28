"use client";

import { useParams } from "next/navigation";

import { useLocalizedRouter } from "@/shared/i18n";

import { useRecipeDetailQuery } from "@/entities/recipe";

import { SlideShowCarousel } from "@/widgets/SlideShowContent";
import SlideShowHeader from "@/widgets/SlideShowHeader";

const RecipeSlideShowPage = () => {
  const router = useLocalizedRouter();
  const { recipeId } = useParams<{ recipeId: string }>();
  const { recipeData: recipe } = useRecipeDetailQuery(recipeId);

  const handleRateClick = () => {
    router.push(`/recipes/${recipe.id}/rate`);
  };

  return (
    <div className="bg-background h-screen pb-12">
      <SlideShowHeader
        title={`${recipe.title} - 레시피오`}
        text={`${recipe.author.nickname}님의 ${recipe.title} 레시피를 확인해보세요!`}
      />
      <SlideShowCarousel recipe={recipe} onRateClick={handleRateClick} />
    </div>
  );
};

export default RecipeSlideShowPage;
