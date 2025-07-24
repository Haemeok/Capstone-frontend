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

  if (isGenerating) {
    return <AiLoading name={selectedAI.name} />;
  }

  if (isCompleted && generatedRecipeData) {
    return (
      <AIRecipeComplete
        selectedAI={selectedAI}
        generatedRecipe={generatedRecipeData}
      />
    );
  }

  if (isError && error) {
    return <AIRecipeError error={error} />;
  }

  return <AIRecipeForm />;
};

export default AIRecipePage;
