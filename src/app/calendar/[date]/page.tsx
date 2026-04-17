"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { DollarSign, Salad } from "lucide-react";

import { Container } from "@/shared/ui/Container";
import IconToggle from "@/shared/ui/IconToggle";
import PrevButton from "@/shared/ui/PrevButton";

import { useRecipeHistoryItemsQuery } from "@/entities/recipe/model/hooks";

import { useToastStore } from "@/widgets/Toast/model/store";

import NutritionCard from "./components/NutritionCard";
import RecipeListSection from "./components/RecipeListSection";
import SavingsCard from "./components/SavingsCard";

type TabType = "savings" | "nutrition";

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
  const [activeTab, setActiveTab] = useState<TabType>("savings");

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

  return (
    <Container>
      <header className="relative flex items-center justify-center pt-4 pb-2">
        <PrevButton className="absolute left-0" />
        <div className="text-center">
          {formattedDate && typeof formattedDate === "object" ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900">
                {formattedDate.month}월 {formattedDate.day}일{" "}
                {formattedDate.dayName}요일
              </h2>
              <p className="mt-1 text-sm text-gray-500">오늘의 기록</p>
            </>
          ) : (
            <h2 className="text-2xl font-bold text-gray-900">{date} 기록</h2>
          )}
        </div>
      </header>

      <div className="flex justify-center py-4">
        <IconToggle
          leftOption={{
            icon: <DollarSign size={16} />,
            label: "절약",
            value: "savings" as TabType,
          }}
          rightOption={{
            icon: <Salad size={16} />,
            label: "영양",
            value: "nutrition" as TabType,
          }}
          value={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="space-y-6 pb-8">
        {activeTab === "savings" ? (
          <SavingsCard
            totalSavings={totalSavings}
            totalMarketPrice={totalMarketPrice}
          />
        ) : (
          <NutritionCard data={data} />
        )}

        <RecipeListSection data={data} />
      </div>
    </Container>
  );
};

export default CalendarDetailPage;
