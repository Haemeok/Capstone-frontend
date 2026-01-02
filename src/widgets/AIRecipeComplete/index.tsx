"use client";

import { useEffect } from "react";
import { ChefHat, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";

import { useAIRecipeStore } from "@/features/recipe-create-ai/model/store";
import type { AIRecommendedRecipe } from "@/features/recipe-create-ai/model/types";
import { useRecipeDetailQuery } from "@/entities/recipe/model/hooks";
import { addRecentAIRecipe } from "@/shared/config/constants/localStorage";
import Link from "next/link";

type AIRecipeCompleteProps = {
  generatedRecipe: AIRecommendedRecipe;
};

const AIRecipeComplete = ({ generatedRecipe }: AIRecipeCompleteProps) => {
  const { resetStore, selectedAI } = useAIRecipeStore();
  const { recipeData } = useRecipeDetailQuery(generatedRecipe.recipeId);

  useEffect(() => {
    if (recipeData && selectedAI) {
      addRecentAIRecipe({
        recipeId: recipeData.id,
        aiModelId: selectedAI.id,
        timestamp: Date.now(),
        title: recipeData.title,
        imageUrl: recipeData.imageUrl,
        authorName: recipeData.author.nickname,
        authorId: recipeData.author.id,
        profileImage: recipeData.author.profileImage,
        cookingTime: recipeData.cookingTime,
        createdAt: recipeData.createdAt || new Date().toISOString(),
      });
    }
  }, [recipeData, selectedAI]);

  const handleStartOver = () => {
    resetStore();
  };

  return (
    <div className="flex min-h-[calc(100dvh-77px)] items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="border-olive-light/20 relative rounded-3xl border-8 bg-white p-8 shadow-2xl">
          <div className="relative z-10 space-y-4 text-center">
            <div className="bg-olive-light/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <div className="text-4xl">🎉</div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                레시피 생성 완료!
              </h1>
            </div>

            <div className="space-y-3 pt-4">
              <Link
                href={`/recipes/${generatedRecipe.recipeId}`}
                onClick={handleStartOver}
                className="bg-olive-light hover:bg-olive-light/90 flex h-12 w-full items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              >
                <ChefHat className="mr-2 h-5 w-5" />
                <p className="text-lg font-bold text-white">레시피 보러가기</p>
              </Link>

              <Button
                onClick={handleStartOver}
                variant="outline"
                className="h-12 w-full rounded-xl border-1 border-gray-300 text-lg font-medium text-gray-700 transition-all duration-200 hover:scale-[1.02] hover:bg-gray-50"
              >
                <RotateCcw className="mr-2 h-5 w-5" />새 레시피 만들기
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          생성된 레시피는 나의 레시피에 자동으로 저장됩니다
        </div>
      </div>
    </div>
  );
};

export default AIRecipeComplete;
