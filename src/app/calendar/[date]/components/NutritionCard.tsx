"use client";

import { useEffect, useState } from "react";

import { cn } from "@/shared/lib/utils";

import { RecipeHistoryDetailResponse } from "@/entities/recipe/model/record";

import { getSodiumStatus } from "../lib/getSodiumStatus";

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
        <span className="text-ink-sub text-base font-medium">{label}</span>
        <span
          className={cn(
            "text-sm",
            isComplete ? "text-olive-dark font-bold" : "text-ink-muted"
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

const SodiumStatus = ({ sodium }: SodiumStatusProps) => {
  const status = getSodiumStatus(sodium);

  return (
    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
      <div>
        <p className="text-ink-sub text-base font-medium">나트륨</p>
        <p
          className={cn(
            "mt-0.5 text-sm",
            status.tone === "caution" ? "text-amber-700" : "text-ink-muted"
          )}
        >
          {status.label} · {status.description}
        </p>
      </div>
      <span className="text-ink-sub text-base font-medium">
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
    <section className="border-t border-gray-100 py-6">
      <h3 className="text-ink mb-5 text-lg font-bold">영양</h3>

      <div className="mb-6 text-center">
        <p className="text-ink-muted text-sm">총 섭취 칼로리</p>
        <div className="mt-1 flex items-baseline justify-center gap-1.5">
          <span className="text-olive-dark text-5xl font-bold">
            {totalCalories.toLocaleString()}
          </span>
          <span className="text-ink-muted text-xl font-medium">kcal</span>
        </div>
        <p className="text-ink-muted mt-2 text-sm">
          권장량의{" "}
          <span className="text-olive-dark font-bold">
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
    </section>
  );
};

export default NutritionCard;
