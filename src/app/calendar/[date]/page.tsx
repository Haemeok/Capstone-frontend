"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { useRecipeHistoryItemsQuery } from "@/entities/recipe/model/hooks";

import { useToastStore } from "@/widgets/Toast/model/store";

import NutritionCard from "./components/NutritionCard";
import RecipeListSection from "./components/RecipeListSection";
import SavingsCard from "./components/SavingsCard";
import { buildDaySummary } from "./lib/buildDaySummary";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

const formatKoreanDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayName = DAY_NAMES[d.getDay()];
  return { month, day, dayName };
};

const CalendarDetailPage = () => {
  const { date } = useParams<{ date: string }>();
  const router = useRouter();
  const { addToast } = useToastStore();

  const { data } = useRecipeHistoryItemsQuery(date, !!date);

  const formattedDate = useMemo(
    () => (date ? formatKoreanDate(date) : null),
    [date]
  );

  if (date === undefined) {
    router.push("/");
    addToast({
      message: "잘못된 접근입니다.",
      variant: "error",
      position: "bottom",
    });
    return;
  }

  const totalSavings =
    data?.reduce(
      (sum, item) => sum + item.marketPrice - item.ingredientCost,
      0
    ) ?? 0;
  const totalMarketPrice =
    data?.reduce((sum, item) => sum + item.marketPrice, 0) ?? 0;
  const recipeCount = data?.length ?? 0;

  return (
    <Container>
      <header className="relative flex items-center justify-center pt-4 pb-2">
        <PrevButton className="absolute left-0" />
        <div className="text-center">
          {formattedDate && typeof formattedDate === "object" ? (
            <>
              <h2 className="text-ink text-2xl font-bold">
                {formattedDate.month}월 {formattedDate.day}일{" "}
                {formattedDate.dayName}요일
              </h2>
              <p className="text-ink-muted mt-1 text-sm">
                {buildDaySummary(recipeCount, totalSavings)}
              </p>
            </>
          ) : (
            <h2 className="text-ink text-2xl font-bold">{date} 기록</h2>
          )}
        </div>
      </header>

      <div className="pb-8">
        <SavingsCard
          totalSavings={totalSavings}
          totalMarketPrice={totalMarketPrice}
        />
        <NutritionCard data={data} />
        <RecipeListSection data={data} />
      </div>
    </Container>
  );
};

export default CalendarDetailPage;
