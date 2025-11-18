"use client";

import { useParams, useRouter } from "next/navigation";

import { useRecipeDetailQuery } from "@/entities/recipe";

import { SlideShowCarousel } from "@/widgets/SlideShowContent";
import SlideShowHeader from "@/widgets/SlideShowHeader";

const RecipeSlideShowPage = () => {
  const router = useRouter();
  const { recipeId } = useParams();
  const { recipeData: recipe } = useRecipeDetailQuery(Number(recipeId));

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
