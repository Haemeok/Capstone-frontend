"use client";

import { useAIRecipeGeneration } from "@/features/recipe-create-ai";
import { Container } from "@/shared/ui/Container";

import AiLoading from "@/widgets/AiLoading/AiLoading";
import AIModelSelection from "@/widgets/AIModelSelection";
import AIRecipeComplete from "@/widgets/AIRecipeComplete";
import AIRecipeError from "@/widgets/AIRecipeError";
import AIRecipeForm from "@/widgets/AIRecipeForm";

const AIRecipePage = () => {
  const {
    selectedAI,
    generatedRecipeData,
    error,
    isIdle,
    isGenerating,
    isCompleted,
    isError,
  } = useAIRecipeGeneration();

  if (!selectedAI) {
    return (
      <Container>
        <AIModelSelection />
      </Container>
    );
  }

  if (isGenerating) {
    return (
      <Container>
        <AiLoading aiModelId={selectedAI.id} />
      </Container>
    );
  }

  if (isCompleted && generatedRecipeData) {
    return (
      <Container>
        <AIRecipeComplete
          selectedAI={selectedAI}
          generatedRecipe={generatedRecipeData}
        />
      </Container>
    );
  }

  if (isError && error) {
    return (
      <Container>
        <AIRecipeError error={error} />
      </Container>
    );
  }

  return (
    <Container>
      <AIRecipeForm />
    </Container>
  );
};

export default AIRecipePage;
