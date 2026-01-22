"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";
import { ArrowLeftIcon, ChefHatIcon } from "@/shared/ui/icons";
import { useCreateAIRecipeMutation } from "@/features/recipe-create-ai";
import { useAIRecipeStore } from "@/features/recipe-create-ai/model/store";
import type { NutritionBalanceRequest } from "@/features/recipe-create-ai/model/types";
import { aiModels } from "@/shared/config/constants/aiModel";
import AiLoading from "@/widgets/AiLoading/AiLoading";
import AIRecipeComplete from "@/widgets/AIRecipeComplete";
import AIRecipeError from "@/widgets/AIRecipeError";
import UsageLimitSection from "@/widgets/AIRecipeForm/UsageLimitSection";

import {
  NutritionMode,
  NutritionFormValues,
  DEFAULT_FORM_VALUES,
} from "./constants";
import { MacroSlider, ModeToggle, StyleSelector } from "./components";

const NutritionRecipePage = () => {
  const router = useRouter();
  const [mode, setMode] = useState<NutritionMode>("MACRO");

  const {
    generationState,
    generatedRecipeData,
    error: storeError,
  } = useAIRecipeStore();
  const { createAIRecipe, reset: resetMutation } = useCreateAIRecipeMutation();

  const isPending = generationState === "generating";
  const isSuccess = generationState === "completed";
  const error = storeError ? { message: storeError } : null;

  const { control, handleSubmit, watch, setValue, reset } =
    useForm<NutritionFormValues>({
      defaultValues: DEFAULT_FORM_VALUES,
    });

  useEffect(() => {
    reset({ ...DEFAULT_FORM_VALUES, mode });
  }, [mode, reset]);

  const onSubmit = (data: NutritionFormValues) => {
    const formatValue = (val: string, unit: string) => {
      if (val === "제한 없음") return val;
      return `${val}${unit}`;
    };

    const request: NutritionBalanceRequest = {
      targetStyle: data.targetStyle,
      targetCalories:
        mode === "MACRO"
          ? "제한 없음"
          : formatValue(data.targetCalories, "kcal"),
      targetCarbs:
        mode === "MACRO" ? formatValue(data.targetCarbs, "g") : "제한 없음",
      targetProtein:
        mode === "MACRO" ? formatValue(data.targetProtein, "g") : "제한 없음",
      targetFat:
        mode === "MACRO" ? formatValue(data.targetFat, "g") : "제한 없음",
    };

    createAIRecipe({
      request,
      concept: "NUTRITION_BALANCE",
    });
  };

  if (isPending) {
    return (
      <Container padding={false}>
        <AiLoading aiModelId="NUTRITION_BALANCE" />
      </Container>
    );
  }

  if (isSuccess && generatedRecipeData) {
    return (
      <Container padding={false} className="h-full">
        <AIRecipeComplete generatedRecipe={generatedRecipeData} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container padding={false}>
        <AIRecipeError
          error={error.message || "레시피 생성 중 오류가 발생했습니다."}
          onRetry={resetMutation}
        />
      </Container>
    );
  }

  return (
    <Container padding={false}>
      <div className="mx-auto bg-[#f7f7f7] p-4 pb-24 md:pb-4">
        <div className="mb-4 flex items-center gap-2">
          <PrevButton className="text-gray-600 md:hidden" />
          <button
            onClick={() => router.back()}
            className="hidden items-center gap-2 text-gray-600 transition-colors hover:text-gray-800 md:flex"
          >
            <ArrowLeftIcon size={20} />
            <span className="text-sm font-medium">AI 다시 선택하기</span>
          </button>
        </div>

        <div className="mb-8 space-y-8 rounded-2xl bg-white p-6 shadow-lg">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">
              {aiModels["NUTRITION_BALANCE"].name}
            </h2>
            <p className="text-sm text-gray-500">
              {aiModels["NUTRITION_BALANCE"].description}
            </p>
          </div>

          <StyleSelector
            value={watch("targetStyle")}
            onChange={(value) => setValue("targetStyle", value)}
          />

          <ModeToggle mode={mode} onModeChange={setMode} />

          {mode === "MACRO" ? (
            <div
              key="macro-sliders"
              className="animate-in fade-in slide-in-from-top-2 space-y-8"
            >
              <MacroSlider
                control={control}
                name="targetCarbs"
                label="탄수화물"
                unit="g"
                max={150}
                step={5}
                defaultValue="70"
              />
              <MacroSlider
                control={control}
                name="targetProtein"
                label="단백질"
                unit="g"
                max={150}
                step={5}
                defaultValue="25"
              />
              <MacroSlider
                control={control}
                name="targetFat"
                label="지방"
                unit="g"
                max={100}
                step={5}
                defaultValue="15"
              />
            </div>
          ) : (
            <div
              key="calorie-sliders"
              className="animate-in fade-in slide-in-from-top-2 space-y-8"
            >
              <MacroSlider
                control={control}
                name="targetCalories"
                label="목표 칼로리"
                unit="kcal"
                max={2000}
                step={50}
                defaultValue="700"
              />
            </div>
          )}
        </div>

        <UsageLimitSection>
          {({ hasNoQuota }) => (
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={hasNoQuota}
              className="bg-olive-light hover:bg-olive-medium flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              <ChefHatIcon className="h-6 w-6" />
              <span>레시피 생성하기</span>
            </button>
          )}
        </UsageLimitSection>
      </div>
    </Container>
  );
};

export default NutritionRecipePage;
