"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DollarSign, Salad } from "lucide-react";

import PrevButton from "@/shared/ui/PrevButton";
import IconToggle from "@/shared/ui/IconToggle";

import { useRecipeHistoryItemsQuery } from "@/entities/recipe/model/hooks";

import { useToastStore } from "@/widgets/Toast/model/store";

import SavingsCard from "./components/SavingsCard";
import NutritionCard from "./components/NutritionCard";
import RecipeListSection from "./components/RecipeListSection";
import { Container } from "@/shared/ui/Container";

type TabType = "savings" | "nutrition";

const CalendarDetailPage = () => {
  const { date } = useParams<{ date: string }>();
  const router = useRouter();
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<TabType>("savings");

  const { data } = useRecipeHistoryItemsQuery(date, !!date);

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
      <header className="relative flex items-center justify-center p-4">
        <PrevButton className="absolute left-4" />
        <h2 className="text-xl font-bold">{date} 기록</h2>
      </header>

      <div className="flex justify-center pb-4">
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

      {activeTab === "savings" ? (
        <SavingsCard
          totalSavings={totalSavings}
          totalMarketPrice={totalMarketPrice}
        />
      ) : (
        <NutritionCard data={data} />
      )}

      <RecipeListSection data={data} />
    </Container>
  );
};

export default CalendarDetailPage;
