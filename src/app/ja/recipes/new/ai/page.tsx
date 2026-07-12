"use client";

import { useEffect } from "react";

import { useLocalizedRouter } from "@/shared/i18n";
import { DictionaryProvider } from "@/shared/i18n";
import { ja as dict } from "@/shared/i18n/messages/ja";
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
          router.replace("/ja/recipes/new/ai/ingredient");
          break;
        case "COST_EFFECTIVE":
          router.replace("/ja/recipes/new/ai/price");
          break;
        case "NUTRITION_BALANCE":
          router.replace("/ja/recipes/new/ai/nutrition");
          break;
        case "FINE_DINING":
          router.replace("/ja/recipes/new/ai/finedining");
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
