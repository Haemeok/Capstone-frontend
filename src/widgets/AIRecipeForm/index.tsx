"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { ArrowLeft, ChefHat, Clock, User } from "lucide-react";

import { cookingTimes } from "@/shared/config/constants/recipe";
import { DISH_TYPES } from "@/shared/config/constants/recipe";
import ProgressButton from "@/shared/ui/ProgressButton";
import SelectionSection from "@/shared/ui/SelectionSection";

import IngredientSelector from "@/features/recipe-create/ui/IngredientSelector";
import {
  type AIRecommendedRecipeRequest,
  useAIRecipeForm,
  useAIRecipeGeneration,
} from "@/features/recipe-create-ai";

import IngredientManager from "@/widgets/IngredientManager/IngredientManager";

const AIRecipeForm = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const { selectedAI, generateRecipe, resetGeneration } =
    useAIRecipeGeneration();

  const {
    formValues,
    ingredients,
    dishType,
    cookingTime,
    servings,
    isDirty,
    progressPercentage,
    isFormReady,
    addedIngredientIds,
    setAddedIngredientIds,
    handleAddIngredient,
    handleRemoveIngredient,
    handleRemoveAllIngredients,
    handleIncrementServings,
    handleDecrementServings,
    toggleCategory,
    toggleTime,
    handleSubmit,
  } = useAIRecipeForm();

  const onSubmit = (data: Omit<AIRecommendedRecipeRequest, "robotType">) => {
    generateRecipe(data);
  };

  const handleBackToSelection = () => {
    resetGeneration();
  };

  if (!selectedAI) {
    return null;
  }

  return (
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

      <div className="text-center">
        <p className="text-dark text-xl font-semibold">
          {selectedAI.name}와 함께
        </p>
        <p className="text-dark text-xl font-semibold">
          맞춤형 레시피를 생성해보세요 !
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <div className="relative h-80 w-full rounded-2xl">
          <Image
            src={selectedAI.image}
            alt={selectedAI.name}
            className="rounded-2xl object-cover"
            fill
          />
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          {selectedAI.description}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <IngredientManager
            ingredients={ingredients}
            onRemoveIngredient={handleRemoveIngredient}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onRemoveAllIngredients={handleRemoveAllIngredients}
          />

          <div className="space-y-6">
            <SelectionSection
              title="종류"
              icon={<ChefHat size={18} />}
              items={DISH_TYPES}
              selectedItems={dishType}
              onToggle={toggleCategory}
              isSingleSelect={true}
            />

            <SelectionSection
              title="조리시간"
              icon={<Clock size={18} />}
              items={cookingTimes}
              selectedItems={cookingTime ? cookingTime.toString() : ""}
              onToggle={toggleTime}
              isSingleSelect={true}
            />
            <div ref={observerRef} className="h-1 w-full" />
            <div className="mb-3 flex items-center gap-2">
              <span className="text-olive-mint">
                <User size={18} />
              </span>
              <h2 className="text-lg font-semibold text-gray-800">인분</h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleDecrementServings}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600 transition-colors hover:bg-gray-300 disabled:opacity-50"
                disabled={servings <= 1}
              >
                -
              </button>
              <span className="w-20 text-center font-medium text-gray-800">
                {servings}인분
              </span>
              <button
                type="button"
                onClick={handleIncrementServings}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600 transition-colors hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <ProgressButton
          progressPercentage={progressPercentage}
          isFormValid={isFormReady && isDirty}
          onClick={handleSubmit(onSubmit)}
        />
      </form>

      <IngredientSelector
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onIngredientSelect={handleAddIngredient}
        addedIngredientIds={addedIngredientIds}
        setAddedIngredientIds={setAddedIngredientIds}
      />
    </div>
  );
};

export default AIRecipeForm;
