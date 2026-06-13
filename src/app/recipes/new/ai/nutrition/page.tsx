"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { AiFormInArticleAdSlot, BottomAnchorAdSlot } from "@/shared/adsense";
import { aiModels } from "@/shared/config/constants/aiModel";
import { DictionaryProvider, getDictionary } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { ArrowLeftIcon, ChefHatIcon } from "@/shared/ui/icons";
import PrevButton from "@/shared/ui/PrevButton";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import type { NutritionBalanceRequest } from "@/features/recipe-create-ai/model/types";
import { useConceptJob } from "@/features/recipe-create-ai/model/useConceptJob";

import AIConceptShell from "@/widgets/AIConceptShell";
import UsageLimitSection from "@/widgets/AIRecipeForm/UsageLimitSection";

import { MacroSlider, ModeToggle, StyleSelector } from "./components";
import {
  MACRO_MODE_DEFAULTS,
  MODE_DEFAULTS,
  NutritionFormValues,
  NutritionMode,
} from "./constants";

const CONCEPT = "NUTRITION_BALANCE" as const;

const NutritionRecipePage = () => {
  const router = useRouter();
  const [mode, setMode] = useState<NutritionMode>("MACRO");

  const { job, isPending, isFailed, progress, submit, retry } =
    useConceptJob(CONCEPT);

  const { control, handleSubmit, watch, setValue, reset } =
    useForm<NutritionFormValues>({
      defaultValues: MACRO_MODE_DEFAULTS,
    });

  // 모드 변경 시 form을 먼저 reset한 후 mode 상태 변경 (애니메이션 깜빡임 방지)
  const handleModeChange = (newMode: NutritionMode) => {
    reset(MODE_DEFAULTS[newMode]);
    setMode(newMode);
  };

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

    submit(
      request,
      `${data.targetStyle} / ${mode === "MACRO" ? "탄단지" : "칼로리"}`
    );
  };

  return (
    <AIConceptShell
      concept={CONCEPT}
      job={job}
      isPending={isPending}
      isFailed={isFailed}
      progress={progress}
      onRetry={retry}
    >
      <Container padding={false}>
        <div className="mx-auto bg-[#f7f7f7] p-4 pb-24 md:pb-24">
          <div className="mb-4 flex items-center gap-2">
            <PrevButton className="text-ink-sub md:hidden" />
            <button
              onClick={() => router.back()}
              className="text-ink-sub hover:text-ink hidden items-center gap-2 transition-colors md:flex"
            >
              <ArrowLeftIcon size={20} />
              <span className="text-sm font-medium">AI 다시 선택하기</span>
            </button>
          </div>

          <div className="mb-8 space-y-8 rounded-2xl bg-white p-6 shadow-lg">
            <div className="text-center">
              <h2 className="text-ink text-xl font-bold">
                {aiModels[CONCEPT].name}
              </h2>
              <p className="text-ink-muted text-sm">
                {aiModels[CONCEPT].description}
              </p>
            </div>

            <StyleSelector
              value={watch("targetStyle")}
              onChange={(value) => setValue("targetStyle", value)}
            />
          </div>

          <AiFormInArticleAdSlot className="mb-8" />

          <div className="mb-8 space-y-8 rounded-2xl bg-white p-6 shadow-lg">
            <ModeToggle mode={mode} onModeChange={handleModeChange} />

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
                disabled={hasNoQuota || isPending}
                className="bg-olive-light hover:bg-olive-medium flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
              >
                <ChefHatIcon className="h-6 w-6" />
                <span>레시피 생성하기</span>
              </button>
            )}
          </UsageLimitSection>
        </div>
      </Container>
    </AIConceptShell>
  );
};

const NutritionRecipePageWithErrorBoundary = () => (
  <DictionaryProvider dict={getDictionary("ko")}>
    <ErrorBoundary
      fallback={
        <SectionErrorFallback message="AI 레시피 생성 중 문제가 발생했어요" />
      }
    >
      <NutritionRecipePage />
    </ErrorBoundary>
    <BottomAnchorAdSlot />
  </DictionaryProvider>
);

export default NutritionRecipePageWithErrorBoundary;
