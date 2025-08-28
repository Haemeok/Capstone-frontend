"use client";

import { useRef, useState } from "react";

import { ArrowLeft } from "lucide-react";

import AIRecipeProgressButton from "./AIRecipeProgressButton";

import IngredientSelector from "@/features/recipe-create/ui/IngredientSelector";
import {
  useAIRecipeForm,
  useAIRecipeGeneration,
} from "@/features/recipe-create-ai";

import IngredientManager from "@/widgets/IngredientManager/IngredientManager";
import { FormProvider } from "react-hook-form";
import DishTypeSection from "./DishTypeSection";
import CookingTimeSection from "./CookingTimeSection";
import ServingsCounter from "./ServingsCounter";
import AiCharacterSection from "./AiCharacterSection";
import { AIRecipeFormValues } from "@/features/recipe-create-ai/model/schema";

const AIRecipeForm = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const { selectedAI, generateRecipe, resetGeneration } =
    useAIRecipeGeneration();

  const {
    methods,
    handleAddIngredient,
    addedIngredientIds,
    setAddedIngredientIds,
  } = useAIRecipeForm();

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
          <AIRecipeProgressButton isLoading={false} />
        </form>
        <IngredientSelector
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          onIngredientSelect={handleAddIngredient}
          addedIngredientIds={addedIngredientIds}
          setAddedIngredientIds={setAddedIngredientIds}
        />
      </div>
    </FormProvider>
  );
};

export default AIRecipeForm;
