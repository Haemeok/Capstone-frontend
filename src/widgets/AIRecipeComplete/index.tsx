"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { ChefHat, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";

import {
  type AIModel,
  useAIRecipeStore,
} from "@/features/recipe-create-ai/model/store";
import type { AIRecommendedRecipe } from "@/features/recipe-create-ai/model/types";

type AIRecipeCompleteProps = {
  selectedAI: AIModel;
  generatedRecipe: AIRecommendedRecipe;
};

const AIRecipeComplete = ({
  selectedAI,
  generatedRecipe,
}: AIRecipeCompleteProps) => {
  const router = useRouter();
  const { resetStore } = useAIRecipeStore();

  const handleGoToRecipe = () => {
    if (generatedRecipe.recipeId) {
      router.replace(`/recipes/${generatedRecipe.recipeId}`);
      resetStore();
    }
  };

  const handleStartOver = () => {
    resetStore();
  };

  return (
    <div className="flex h-full items-center justify-center bg-[#f7f7f7] p-4">
      <div className="w-full max-w-md">
        <div className="relative rounded-3xl bg-white p-8 shadow-2xl border-8 border-olive-mint/20">
          <div className="relative z-10 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-olive-mint/10 flex items-center justify-center mb-4">
              <div className="text-4xl">🎉</div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                레시피 생성 완료!
              </h1>
              <p className="text-gray-600">
                {selectedAI.name}가 맛있는 레시피를 만들어 드렸어요!
              </p>
            </div>

            <div className="relative h-44 w-44 mx-auto rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={selectedAI.image}
                alt={selectedAI.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={handleGoToRecipe}
                className="w-full h-12 bg-olive-mint hover:bg-olive-mint/90 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
              >
                <ChefHat className="mr-2 h-5 w-5" />
                레시피 보러가기
              </Button>

              <Button
                onClick={handleStartOver}
                variant="outline"
                className="w-full h-12 border-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-lg font-medium rounded-xl transition-all duration-200 hover:scale-[1.02]"
              >
                <RotateCcw className="mr-2 h-5 w-5" />새 레시피 만들기
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-400">
          생성된 레시피는 나의 레시피에 자동으로 저장됩니다
        </div>
      </div>
    </div>
  );
};

export default AIRecipeComplete;
