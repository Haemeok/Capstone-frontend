"use client";

import { useMemo } from "react";

import { formatNumber } from "@/shared/lib/format";
import { PRICE_BRACKETS } from "@/shared/config/constants/recipe";
import SavingSection from "@/shared/ui/SavingSection";
import CountUp from "@/shared/ui/shadcn/CountUp";

import FirstSavingsQuestPanel from "../CalendarTabContent/FirstSavingsQuestPanel";
import { useUserStore } from "@/entities/user";

type MonthlySavingsSummaryProps = {
  year: number;
  month: number;
  monthlyTotalSavings: number | undefined;
  productName: string;
  productImage: string;
};

const MonthlySavingsSummary = ({
  year,
  month,
  monthlyTotalSavings,
  productName,
  productImage,
}: MonthlySavingsSummaryProps) => {
  const user = useUserStore((state) => state.user);
  const hasFirstRecord = user?.hasFirstRecord ?? false;

  const currentSavings = monthlyTotalSavings ?? 0;

  const { currentMin, next, percentageToNext } = useMemo(() => {
    const idx = PRICE_BRACKETS.findIndex((b) => currentSavings >= b.min);
    const safeIndex = idx === -1 ? PRICE_BRACKETS.length - 1 : idx;
    const currentBracket = PRICE_BRACKETS[safeIndex];
    const nextBracket =
      safeIndex > 0 ? PRICE_BRACKETS[safeIndex - 1] : undefined;

    if (!nextBracket) {
      return {
        currentIndex: safeIndex,
        currentMin: currentBracket.min,
        next: undefined as undefined,
        percentageToNext: 100,
        remainingToNext: 0,
      };
    }

    const range = Math.max(1, nextBracket.min - currentBracket.min);
    const progressed = Math.max(0, currentSavings - currentBracket.min);
    const percent = Math.min(100, Math.floor((progressed / range) * 100));
    const remaining = Math.max(0, nextBracket.min - currentSavings);
    return {
      currentIndex: safeIndex,
      currentMin: currentBracket.min,
      next: nextBracket,
      percentageToNext: percent,
      remainingToNext: remaining,
    };
  }, [currentSavings]);

  const savingText =
    currentSavings === 0
      ? `아직 절약을 시작하지 않았어요!`
      : `${productName} 정도 금액이에요!`;

  return (
    <div className="mx-10 flex flex-col items-center justify-center pt-5">
      <h3 className="text-xl font-bold">
        {year}년 {month}월 레시피오 서비스로
      </h3>
      <div className="flex">
        <CountUp
          from={0}
          to={currentSavings}
          duration={0.1}
          separator=","
          direction="up"
          className="text-olive-mint text-xl font-bold"
        />
        <span className="text-olive-mint text-xl font-bold">원</span>
        <h3 className="ml-1 text-xl font-bold"> 절약했어요</h3>
      </div>
      <p className="mt-1 text-sm text-gray-500">{savingText}</p>

      {!hasFirstRecord && <FirstSavingsQuestPanel />}
      <SavingSection imageUrl={productImage} altText={productName} />

      <div className="w-full">
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="bg-olive-mint absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentageToNext}%` }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0, rgba(255,255,255,0.6) 8px, transparent 8px, transparent 16px)",
              }}
            />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
          <span>현재 단계 {formatNumber(currentMin, "원")}</span>
          {next ? (
            <span>다음 단계 {formatNumber(next.min, "원")}</span>
          ) : (
            <span>최고 단계 달성</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlySavingsSummary;
