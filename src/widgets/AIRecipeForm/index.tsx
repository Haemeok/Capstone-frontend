"use client";

import { useRef, useState } from "react";
import { FormProvider, useWatch } from "react-hook-form";

import { ArrowLeft } from "lucide-react";

import IngredientSelector from "@/features/recipe-create/ui/IngredientSelector";
import {
  useAIRecipeForm,
  useAIRecipeGeneration,
} from "@/features/recipe-create-ai";
import { AIRecipeFormValues } from "@/features/recipe-create-ai/model/schema";

import IngredientManager from "@/widgets/IngredientManager/IngredientManager";

import AiCharacterSection from "./AiCharacterSection";
import AIRecipeProgressButton from "./AIRecipeProgressButton";
import CookingTimeSection from "./CookingTimeSection";
import DishTypeSection from "./DishTypeSection";
import ServingsCounter from "./ServingsCounter";
import UsageLimitSection from "./UsageLimitSection";

const AIRecipeForm = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const { selectedAI, generateRecipe, resetGeneration } =
    useAIRecipeGeneration();

  const { methods, handleAddIngredient } = useAIRecipeForm();

  const ingredients = useWatch({
    control: methods.control,
    name: "ingredients",
  });

  const onSubmit = (data: AIRecipeFormValues) => {
    generateRecipe(data);
  };

  const handleBackToSelection = () => {
    resetGeneration();
  };

  if (!selectedAI) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <div className="relative mx-auto bg-[#f7f7f7] p-4">
        <div className="mb-4">
          <button
            onClick={handleBackToSelection}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">AI 다시 선택하기</span>
          </button>
        </div>
        <AiCharacterSection selectedAI={selectedAI} />
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
            <IngredientManager onOpenDrawer={() => setIsDrawerOpen(true)} />

            <div className="space-y-6">
              <DishTypeSection />
              <CookingTimeSection />
              <div ref={observerRef} className="h-1 w-full" />
              <ServingsCounter />
            </div>
          </div>
          <UsageLimitSection>
            {({ hasNoQuota }) => (
              <AIRecipeProgressButton isLoading={false} disabled={hasNoQuota} />
            )}
          </UsageLimitSection>
        </form>
        <IngredientSelector
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          onIngredientSelect={handleAddIngredient}
          addedIngredientNames={new Set((ingredients || []).map((ing) => ing.name))}
          mapIngredientToPayload={(ingredient) => ({
            id: ingredient.id,
            name: ingredient.name,
          })}
        />
      </div>
    </FormProvider>
  );
};

export default AIRecipeForm;
