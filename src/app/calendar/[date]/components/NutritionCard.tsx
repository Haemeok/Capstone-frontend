"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";

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

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">
          {value}
          {unit} / {max}
          {unit}
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn(
            "absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out",
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
  const getSodiumStatus = () => {
    if (sodium <= 2000) {
      return {
        emoji: "🟢",
        label: "좋음",
        description: "적정 섭취량이에요!",
        color: "text-green-600",
      };
    }
    if (sodium <= 3000) {
      return {
        emoji: "🟡",
        label: "보통",
        description: "조금 많이 드셨어요",
        color: "text-yellow-600",
      };
    }
    return {
      emoji: "🔴",
      label: "주의",
      description: "짜게 드셨네요!",
      color: "text-red-600",
    };
  };

  const status = getSodiumStatus();

  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{status.emoji}</span>
        <div>
          <p className="text-sm font-medium text-gray-700">나트륨</p>
          <p className={cn("text-xs font-semibold", status.color)}>
            {status.label} · {status.description}
          </p>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-600">{sodium}mg</span>
    </div>
  );
};

const NutritionCard = () => {
  // 하드코딩 값
  const TOTAL_CALORIES = 1850;
  const RECOMMENDED_CALORIES = 2000;
  const CARBS = 250;
  const PROTEIN = 80;
  const FAT = 50;
  const SODIUM = 2500;

  const CARBS_MAX = 300;
  const PROTEIN_MAX = 100;
  const FAT_MAX = 70;

  const caloriePercentage = Math.round(
    (TOTAL_CALORIES / RECOMMENDED_CALORIES) * 100
  );

  return (
    <div className="mx-4 mb-4 space-y-4 rounded-2xl border-1 border-olive-light/30 p-6">
      {/* 헤더: 총 칼로리 */}
      <div className="border-b border-gray-200 pb-4 text-center">
        <p className="mb-1 text-sm text-gray-500">오늘의 총 섭취 칼로리</p>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-bold text-olive-mint">
            {TOTAL_CALORIES.toLocaleString()}
          </span>
          <span className="text-xl font-medium text-gray-600">kcal</span>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-600">
          권장량의{" "}
          <span className="font-bold text-olive-dark">{caloriePercentage}%</span>
        </p>
      </div>

      {/* 바디: 3대 영양소 막대 그래프 */}
      <div className="space-y-4 py-2">
        <NutrientBar
          label="탄수화물"
          value={CARBS}
          max={CARBS_MAX}
          color="bg-olive"
          unit="g"
        />
        <NutrientBar
          label="단백질"
          value={PROTEIN}
          max={PROTEIN_MAX}
          color="bg-olive-medium"
          unit="g"
        />
        <NutrientBar
          label="지방"
          value={FAT}
          max={FAT_MAX}
          color="bg-olive-light"
          unit="g"
        />
      </div>

      {/* 푸터: 나트륨 신호등 */}
      <div className="pt-2">
        <SodiumStatus sodium={SODIUM} />
      </div>
    </div>
  );
};

export default NutritionCard;
