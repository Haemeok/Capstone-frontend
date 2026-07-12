"use client";

import { useEffect } from "react";

import { useLocalizedRouter } from "@/shared/i18n";
import { DictionaryProvider } from "@/shared/i18n";
import { en as dict } from "@/shared/i18n/messages/en";
import { Container } from "@/shared/ui/Container";

import { useAIRecipeStore } from "@/features/recipe-create-ai/model/store";

import AIModelSelection from "@/widgets/AIModelSelection";

const AIRecipePage = () => {
  const router = useLocalizedRouter();
  const { generationState, selectedAI } = useAIRecipeStore();

  const shouldRedirect =
    (generationState === "generating" || generationState === "completed") &&
    !!selectedAI;

  useEffect(() => {
    if (shouldRedirect && selectedAI) {
      switch (selectedAI.id) {
        case "INGREDIENT_FOCUS":
          router.replace("/en/recipes/new/ai/ingredient");
          break;
        case "COST_EFFECTIVE":
          router.replace("/en/recipes/new/ai/price");
          break;
        case "NUTRITION_BALANCE":
          router.replace("/en/recipes/new/ai/nutrition");
          break;
        case "FINE_DINING":
          router.replace("/en/recipes/new/ai/finedining");
          break;
      }
    }
  }, [shouldRedirect, selectedAI, router]);

  if (shouldRedirect) {
    return null;
  }

  return (
    <DictionaryProvider dict={dict}>
      <Container padding={false} className="min-h-full">
        <AIModelSelection />
      </Container>
    </DictionaryProvider>
  );
};

export default AIRecipePage;
