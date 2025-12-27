"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChefHat, Info } from "lucide-react";

import { Container } from "@/shared/ui/Container";
import { useCreateAIRecipeMutation } from "@/features/recipe-create-ai";
import type { NutritionBalanceRequest } from "@/features/recipe-create-ai/model/types";
import { aiModels } from "@/shared/config/constants/aiModel";
import AiLoading from "@/widgets/AiLoading/AiLoading";
import AIRecipeComplete from "@/widgets/AIRecipeComplete";
import AIRecipeError from "@/widgets/AIRecipeError";

import PrevButton from "@/shared/ui/PrevButton";
import { Slider } from "@/shared/ui/shadcn/slider";
import { useAIRecipeStore } from "@/features/recipe-create-ai/model/store";

type NutritionMode = "MACRO" | "CALORIE";

type NutritionFormValues = {
  mode: NutritionMode;
  targetStyle: string;
  targetCalories: string;
  targetCarbs: string;
  targetProtein: string;
  targetFat: string;
};

const STYLES = [
  { value: "Asian_Style", label: "🍚 아시안 스타일" },
  { value: "Western_Style", label: "🍝 양식 스타일" },
  { value: "Light_Fresh", label: "🥗 가볍고 신선하게" },
];

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
  const recipeData = generatedRecipeData;
  const error = storeError ? { message: storeError } : null;

  const { control, handleSubmit, watch, setValue, reset } =
    useForm<NutritionFormValues>({
      defaultValues: {
        mode: "MACRO",
        targetStyle: "Asian_Style",
        targetCalories: "제한 없음",
        targetCarbs: "70",
        targetProtein: "25",
        targetFat: "15",
      },
    });

  useEffect(() => {
    reset({
      mode,
      targetStyle: "Asian_Style",
      targetCalories: "제한 없음",
      targetCarbs: "70",
      targetProtein: "25",
      targetFat: "15",
    });
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

  if (isSuccess && recipeData) {
    return (
      <Container padding={false} className="h-full">
        <AIRecipeComplete generatedRecipe={recipeData} />
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
      <div className="mx-auto bg-[#f7f7f7] p-4">
        <div className="mb-4 flex items-center gap-2">
          <PrevButton className="md:hidden" />
          <button
            onClick={() => router.back()}
            className="hidden items-center gap-2 text-gray-600 transition-colors hover:text-gray-800 md:flex"
          >
            <ArrowLeft size={20} />
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
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">
              요리 스타일
            </label>
            <div className="flex gap-2">
              {STYLES.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setValue("targetStyle", style.value)}
                  className={`flex-1 rounded-lg py-3 text-sm font-medium transition-all ${
                    watch("targetStyle") === style.value
                      ? "bg-olive-medium text-white shadow-md"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setMode("MACRO")}
              className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
                mode === "MACRO"
                  ? "text-olive-medium bg-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              탄단지 집중
            </button>
            <button
              onClick={() => setMode("CALORIE")}
              className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
                mode === "CALORIE"
                  ? "text-olive-medium bg-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              칼로리 집중
            </button>
          </div>

          {mode === "MACRO" ? (
            <div
              key="macro-sliders"
              className="animate-in fade-in slide-in-from-top-2 space-y-8"
            >
              <MacroSlider
                key="carbs"
                control={control}
                name="targetCarbs"
                label="탄수화물"
                unit="g"
                max={150}
                step={5}
                defaultValue="70"
              />
              <MacroSlider
                key="protein"
                control={control}
                name="targetProtein"
                label="단백질"
                unit="g"
                max={150}
                step={5}
                defaultValue="25"
              />
              <MacroSlider
                key="fat"
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
                key="calories"
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

        <button
          onClick={handleSubmit(onSubmit)}
          className="from-olive-light to-olive-medium flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <ChefHat className="h-6 w-6" />
          <span>건강 식단 생성하기</span>
        </button>
      </div>
    </Container>
  );
};

const getGuidanceMessage = (name: string, value: number) => {
  if (name === "targetCalories") {
    if (value < 500)
      return "다이어트나 가벼운 식사에 적합해요 (성인 여성 한 끼 권장량 이하)";
    if (value <= 800) return "일반적인 성인 한 끼 식사 권장량이에요";
    return "활동량이 많거나 벌크업 중인 분들에게 추천해요";
  }
  if (name === "targetProtein") {
    if (value < 20) return "가볍게 단백질을 보충하고 싶을 때 좋아요";
    if (value <= 40) return "일반적인 근육 유지 및 회복에 필요한 양이에요";
    return "고강도 운동 후 근육 합성에 최적화된 양이에요 (체중 1kg당 1.6~2g 권장)";
  }
  if (name === "targetCarbs") {
    if (value < 50) return "저탄수화물 식단(키토제닉)에 가까워요";
    if (value <= 100) return "적절한 에너지를 공급하는 균형 잡힌 양이에요";
    return "에너지 소모가 많은 날 든든하게 챙겨드세요";
  }
  if (name === "targetFat") {
    if (value < 15) return "저지방 식단으로 가볍게 즐기세요";
    return "적당한 지방은 포만감을 오래 유지해줘요";
  }
  return "";
};

const MacroSlider = ({
  control,
  name,
  label,
  unit,
  max,
  step,
  defaultValue,
}: any) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const isUnlimited = field.value === "제한 없음";
        const sliderValue = isUnlimited ? 0 : Number(field.value) || 0;

        const handleSliderChange = (vals: number[]) => {
          field.onChange(vals[0].toString());
        };

        const guidance = !isUnlimited
          ? getGuidanceMessage(name, sliderValue)
          : "";

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-700">{label}</label>
              <div className="flex items-center gap-3">
                {!isUnlimited && (
                  <span className="text-olive-medium font-mono text-lg font-bold">
                    {sliderValue}
                    {unit}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() =>
                    field.onChange(isUnlimited ? defaultValue : "제한 없음")
                  }
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isUnlimited
                      ? "bg-olive-medium text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  상관 없음
                </button>
              </div>
            </div>

            <div
              className={isUnlimited ? "pointer-events-none opacity-30" : ""}
            >
              <Slider
                min={0}
                max={max}
                step={step}
                value={[sliderValue]}
                onValueChange={handleSliderChange}
                disabled={isUnlimited}
                className="[&>*[data-slot=slider-range]]:bg-olive-medium [&>*[data-slot=slider-thumb]]:border-olive-medium [&>*[data-slot=slider-thumb]]:bg-white [&>*[data-slot=slider-track]]:bg-gray-200"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>0{unit}</span>
                <span>
                  {max}
                  {unit}
                </span>
              </div>

              {guidance && (
                <div className="bg-olive-light/10 animate-in fade-in slide-in-from-top-1 mt-3 flex items-start gap-2 rounded-lg p-3 text-xs text-gray-600">
                  <Info className="text-olive-medium h-4 w-4 shrink-0" />
                  <span>{guidance}</span>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default NutritionRecipePage;
