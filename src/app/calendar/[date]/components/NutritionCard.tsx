"use client";

import { useEffect, useState } from "react";

import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import { RecipeHistoryDetailResponse } from "@/entities/recipe/model/record";

type NutrientBarProps = {
  label: string;
  value: number;
  max: number;
  color: string;
  unit: string;
};

const NutrientBar = ({ label, value, max, color, unit }: NutrientBarProps) => {
  const [animate, setAnimate] = useState(false);
  const percentage = Math.min((value / max) * 100, 100);
  const isComplete = value >= max;

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-gray-700">{label}</span>
        <span
          className={cn(
            "text-sm",
            isComplete ? "text-olive-dark font-bold" : "text-gray-500"
          )}
        >
          {Math.round(value)}
          {unit} / {max}
          {unit}
          {isComplete && " ✓"}
        </span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn(
            "absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out",
            color
          )}
          style={{
            width: animate ? `${percentage}%` : "0%",
          }}
        />
      </div>
    </div>
  );
};

type SodiumStatusProps = {
  sodium: number;
};

const getSodiumStatus = (sodium: number) => {
  if (sodium <= 3000) {
    return {
      label: "좋음",
      description: "적정 섭취량이에요",
      dotColor: "bg-green-500",
      textColor: "text-green-600",
    };
  }
  if (sodium <= 4000) {
    return {
      label: "보통",
      description: "조금 많이 드셨어요",
      dotColor: "bg-yellow-500",
      textColor: "text-yellow-600",
    };
  }
  return {
    label: "주의",
    description: "짜게 드셨네요",
    dotColor: "bg-red-500",
    textColor: "text-red-600",
  };
};

const SodiumStatus = ({ sodium }: SodiumStatusProps) => {
  const status = getSodiumStatus(sodium);

  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3.5">
      <div className="flex items-center gap-3">
        <Image
          src={`${ICON_BASE_URL}low_sodium.webp`}
          alt="나트륨"
          wrapperClassName="h-9 w-9"
          imgClassName="object-contain"
          fit="contain"
          lazy={false}
        />
        <div>
          <p className="text-base font-medium text-gray-700">나트륨</p>
          <div className="flex items-center gap-1.5">
            <span
              className={cn("h-2.5 w-2.5 rounded-full", status.dotColor)}
            />
            <p className={cn("text-sm font-semibold", status.textColor)}>
              {status.label} · {status.description}
            </p>
          </div>
        </div>
      </div>
      <span className="text-base font-medium text-gray-600">
        {Math.round(sodium)}mg
      </span>
    </div>
  );
};

type NutritionCardProps = {
  data: RecipeHistoryDetailResponse[] | undefined;
};

const RECOMMENDED_CALORIES = 2000;
const CARBS_MAX = 300;
const PROTEIN_MAX = 100;
const FAT_MAX = 70;

const NutritionCard = ({ data }: NutritionCardProps) => {
  const totalCalories =
    data?.reduce((sum, item) => sum + item.calories, 0) ?? 0;
  const carbs =
    data?.reduce((sum, item) => sum + item.nutrition.carbohydrate, 0) ?? 0;
  const protein =
    data?.reduce((sum, item) => sum + item.nutrition.protein, 0) ?? 0;
  const fat = data?.reduce((sum, item) => sum + item.nutrition.fat, 0) ?? 0;
  const sodium =
    data?.reduce((sum, item) => sum + item.nutrition.sodium, 0) ?? 0;

  const caloriePercentage = Math.round(
    (totalCalories / RECOMMENDED_CALORIES) * 100
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2.5">
        <Image
          src={`${ICON_BASE_URL}balanced.webp`}
          alt="영양"
          wrapperClassName="h-7 w-7"
          imgClassName="object-contain"
          fit="contain"
          lazy={false}
        />
        <h3 className="text-lg font-bold text-gray-900">영양 리포트</h3>
      </div>

      <div className="mb-6 border-b border-gray-100 pb-6 text-center">
        <p className="text-base text-gray-500">총 섭취 칼로리</p>
        <div className="mt-1 flex items-baseline justify-center gap-1.5">
          <span className="text-olive-mint text-5xl font-bold">
            {totalCalories.toLocaleString()}
          </span>
          <span className="text-xl font-medium text-gray-500">kcal</span>
        </div>
        <p className="mt-2 text-base text-gray-500">
          권장량의{" "}
          <span className="font-bold text-violet-500">
            {caloriePercentage}%
          </span>
        </p>
      </div>

      <div className="mb-6 space-y-5">
        <NutrientBar
          label="탄수화물"
          value={carbs}
          max={CARBS_MAX}
          color="bg-olive"
          unit="g"
        />
        <NutrientBar
          label="단백질"
          value={protein}
          max={PROTEIN_MAX}
          color="bg-olive-medium"
          unit="g"
        />
        <NutrientBar
          label="지방"
          value={fat}
          max={FAT_MAX}
          color="bg-olive-light"
          unit="g"
        />
      </div>

      <SodiumStatus sodium={sodium} />
    </div>
  );
};

export default NutritionCard;
