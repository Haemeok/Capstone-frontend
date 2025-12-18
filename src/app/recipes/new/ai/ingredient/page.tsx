"use client";

import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";
import { useCreateAIRecipeMutation } from "@/features/recipe-create-ai";
import { useAIRecipeStore } from "@/features/recipe-create-ai/model/store";
import { AIRecipeFormValues } from "@/features/recipe-create-ai/model/schema";
import { aiModels } from "@/shared/config/constants/aiModel";

import AiLoading from "@/widgets/AiLoading/AiLoading";
import AIRecipeComplete from "@/widgets/AIRecipeComplete";
import AIRecipeError from "@/widgets/AIRecipeError";
import IngredientManager from "@/widgets/IngredientManager/IngredientManager";
import IngredientSelector from "@/features/recipe-create/ui/IngredientSelector";
import AiCharacterSection from "@/widgets/AIRecipeForm/AiCharacterSection";
import DishTypeSection from "@/widgets/AIRecipeForm/DishTypeSection";
import CookingTimeSection from "@/widgets/AIRecipeForm/CookingTimeSection";
import ServingsCounter from "@/widgets/AIRecipeForm/ServingsCounter";
import AIRecipeSubmitSection from "@/widgets/AIRecipeForm/AIRecipeSubmitSection";


const IngredientRecipePage = () => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const { generationState, generatedRecipeData, error: storeError } = useAIRecipeStore();
  const { createAIRecipe, reset } = useCreateAIRecipeMutation();

  const isPending = generationState === "generating";
  const isSuccess = generationState === "completed";
  const recipeData = generatedRecipeData;
  const error = storeError ? { message: storeError } : null;


  const methods = useForm<AIRecipeFormValues>({
    defaultValues: {
      ingredients: [],
      dishType: "메인요리",
      cookingTime: 30,
      servings: 1,
    },
  });

  const ingredients = useWatch({
    control: methods.control,
    name: "ingredients",
  });

  const handleAddIngredient = (ingredient: { name: string }) => {
    const currentIngredients = methods.getValues("ingredients");
    if (!currentIngredients.includes(ingredient.name)) {
      methods.setValue("ingredients", [...currentIngredients, ingredient.name]);
    }
  };

  const onSubmit = (data: AIRecipeFormValues) => {
    createAIRecipe({
      request: {
        ...data,
        robotType: "INGREDIENT_FOCUS", 
      } as any, 
      concept: "INGREDIENT_FOCUS",
    });
  };


  if (isPending) {
    return (
      <Container padding={false}>
        <AiLoading aiModelId="INGREDIENT_FOCUS" />
      </Container>
    );
  }

  if (isSuccess && recipeData) {
    return (
      <Container className="h-full" padding={false}>
        <AIRecipeComplete
          selectedAI={aiModels["INGREDIENT_FOCUS"]}
          generatedRecipe={recipeData}
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container padding={false}>
        <AIRecipeError
          error={error.message || "레시피 생성 중 오류가 발생했습니다."}
          onRetry={reset}
        />
      </Container>
    );
  }

  return (
    <Container padding={false}>
      <FormProvider {...methods}>
        <div className="relative mx-auto p-4">
          <div className="mb-4 flex items-center gap-2">
            <PrevButton className="md:hidden" />
            <button
              onClick={() => router.back()}
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">AI 다시 선택하기</span>
            </button>
          </div>
          
          <AiCharacterSection selectedAI={aiModels["INGREDIENT_FOCUS"]} />
          
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
              <IngredientManager onOpenDrawer={() => setIsDrawerOpen(true)} />

              <div className="space-y-6">
                <DishTypeSection />
                <CookingTimeSection />
                <div className="h-1 w-full" />
                <ServingsCounter />
              </div>
            </div>
            <AIRecipeSubmitSection isLoading={isPending} />
          </form>
          
          <IngredientSelector
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            onIngredientSelect={handleAddIngredient}
            addedIngredientNames={new Set(ingredients || [])}
          />
        </div>
      </FormProvider>
    </Container>
  );
};

export default IngredientRecipePage;

