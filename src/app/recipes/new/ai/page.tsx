"use client";

import { useAIRecipeGeneration } from "@/features/recipe-create-ai";

import AiLoading from "@/widgets/AiLoading/AiLoading";
import AIModelSelection from "@/widgets/AIModelSelection";
import AIRecipeComplete from "@/widgets/AIRecipeComplete";
import AIRecipeError from "@/widgets/AIRecipeError";
import AIRecipeForm from "@/widgets/AIRecipeForm";

const AIRecipePage = () => {
  const {
    generationState,
    selectedAI,
    generatedRecipeData,
    error,
    isIdle,
    isGenerating,
    isCompleted,
    isError,
  } = useAIRecipeGeneration();

  console.log(isIdle, selectedAI);

  if (!selectedAI) {
    return <AIModelSelection />;
  }

  // 레시피 생성 중
  if (isGenerating) {
    return <AiLoading name={selectedAI.name} />;
  }

  // 레시피 생성 완료
  if (isCompleted && generatedRecipeData) {
    return (
      <AIRecipeComplete
        selectedAI={selectedAI}
        generatedRecipe={generatedRecipeData}
      />
    );
  }

  // 에러 발생
  if (isError && error) {
    return <AIRecipeError error={error} />;
  }

  // 기본 상태: 레시피 생성 폼
  return <AIRecipeForm />;
};

export default AIRecipePage;
