"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Container } from "@/shared/ui/Container";
import AIModelSelection from "@/widgets/AIModelSelection";
import { useAIRecipeStore } from "@/features/recipe-create-ai/model/store";

const AIRecipePage = () => {
  const router = useRouter();
  const { generationState, selectedAI } = useAIRecipeStore();

  const shouldRedirect =
    (generationState === "generating" || generationState === "completed") &&
    !!selectedAI;

  useEffect(() => {
    if (shouldRedirect && selectedAI) {
      switch (selectedAI.id) {
        case "INGREDIENT_FOCUS":
          router.replace("/recipes/new/ai/ingredient");
          break;
        case "COST_EFFECTIVE":
          router.replace("/recipes/new/ai/price");
          break;
        case "NUTRITION_BALANCE":
          router.replace("/recipes/new/ai/nutrition");
          break;
      }
    }
  }, [shouldRedirect, selectedAI, router]);

  if (shouldRedirect) {
    return null;
  }

  return (
    <Container padding={false}>
      <AIModelSelection />
    </Container>
  );
};

export default AIRecipePage;
