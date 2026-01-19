"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChefHat } from "lucide-react";

import { Container } from "@/shared/ui/Container";
import { useCreateAIRecipeMutation } from "@/features/recipe-create-ai";
import type { NutritionBalanceRequest } from "@/features/recipe-create-ai/model/types";
import { aiModels } from "@/shared/config/constants/aiModel";
import AiLoading from "@/widgets/AiLoading/AiLoading";
import AIRecipeComplete from "@/widgets/AIRecipeComplete";
import AIRecipeError from "@/widgets/AIRecipeError";
import UsageLimitSection from "@/widgets/AIRecipeForm/UsageLimitSection";

import PrevButton from "@/shared/ui/PrevButton";
import { Slider } from "@/shared/ui/shadcn/slider";
import { useAIRecipeStore } from "@/features/recipe-create-ai/model/store";
import { Image } from "@/shared/ui/image";
import { ICON_BASE_URL } from "@/shared/config/constants/recipe";

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
  {
    value: "Asian_Style",
    image: "asian_style.webp",
    label: "아시안 스타일",
    description: "한식, 중식, 일식",
  },
  {
    value: "Western_Style",
    image: "western_style.webp",
    label: "양식 스타일",
    description: "이탈리안, 프렌치",
  },
  {
    value: "Light_Fresh",
    image: "diet_light.webp",
    label: "가볍고 신선하게",
    description: "샐러드, 건강식",
  },
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
      <div className="mx-auto bg-[#f7f7f7] p-4 pb-24 md:pb-4">
        <div className="mb-4 flex items-center gap-2">
          <PrevButton className="text-gray-600 md:hidden" />
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
            <div className="grid grid-cols-3 gap-3">
              {STYLES.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setValue("targetStyle", style.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    watch("targetStyle") === style.value
                      ? "border-olive-light bg-olive-light/10 shadow-[0_0_0_3px_rgba(145,199,136,0.2)]"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Image
                    src={`${ICON_BASE_URL}${style.image}`}
                    alt={style.label}
                    wrapperClassName="w-12 h-12"
                  />
                  <span
                    className={`text-sm font-bold text-pretty break-keep ${
                      watch("targetStyle") === style.value
                        ? "text-olive-light"
                        : "text-gray-700"
                    }`}
                  >
                    {style.label}
                  </span>
                  <span className="text-xs text-pretty break-keep text-gray-500">
                    {style.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setMode("MACRO")}
              className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
                mode === "MACRO"
                  ? "text-olive-light bg-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              탄단지 집중
            </button>
            <button
              onClick={() => setMode("CALORIE")}
              className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
                mode === "CALORIE"
                  ? "text-olive-light bg-white shadow-sm"
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

        <UsageLimitSection>
          {({ hasNoQuota }) => (
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={hasNoQuota}
              className="bg-olive-light hover:bg-olive-medium flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              <ChefHat className="h-6 w-6" />
              <span>레시피 생성하기</span>
            </button>
          )}
        </UsageLimitSection>
      </div>
    </Container>
  );
};

const getGuidanceMessage = (name: string, value: number) => {
  if (name === "targetCalories") {
    if (value < 500) return "⚡ 다이어트 집중 모드!";
    if (value <= 800) return "🍽️ 딱 좋은 한 끼";
    if (value <= 1200) return "💪 에너지 충전!";
    return "🔥 벌크업 가즈아!";
  }
  if (name === "targetProtein") {
    if (value < 20) return "🥗 가벼운 단백질";
    if (value <= 40) return "💪 균형 잡힌 근육 케어";
    return "🏋️ 득근 가즈아!";
  }
  if (name === "targetCarbs") {
    if (value < 50) return "🔥 저탄고지 모드!";
    if (value <= 100) return "⚖️ 균형 잡힌 에너지";
    return "⚡ 에너지 폭발!";
  }
  if (name === "targetFat") {
    if (value < 15) return "🥗 클린 식단!";
    if (value <= 30) return "👍 적당한 포만감";
    return "🧈 건강한 지방 섭취";
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
                  <span className="text-olive-light font-mono text-lg font-bold">
                    {sliderValue}
                    {unit}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isUnlimited ? "text-gray-400" : "text-olive-light"
                    }`}
                  >
                    지정
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(isUnlimited ? defaultValue : "제한 없음")
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isUnlimited ? "bg-olive-light" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                        isUnlimited ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isUnlimited ? "text-olive-light" : "text-gray-400"
                    }`}
                  >
                    자동
                  </span>
                </div>
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
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>0{unit}</span>
                <span>
                  {max}
                  {unit}
                </span>
              </div>

              {guidance && (
                <div className="animate-in fade-in slide-in-from-top-1 mt-3 flex justify-center">
                  <span className="inline-block rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-600">
                    {guidance}
                  </span>
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
