"use client";

import { useState } from "react";
import { ChefHat } from "lucide-react";
import BudgetHeader from "./BudgetHeader";
import PriceSlider from "./PriceSlider";
import CategorySelector from "./CategorySelector";
import { BUDGET_DEFAULT } from "@/shared/config/constants/budget";

const BudgetRecipe = () => {
  const [budget, setBudget] = useState(BUDGET_DEFAULT);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleGenerateRecipe = () => {
    if (!selectedCategory) {
      alert("음식 종류를 선택해주세요!");
      return;
    }

    console.log("Generate recipe with:", {
      budget,
      category: selectedCategory,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige to-white py-8">
      <div className="mx-auto max-w-2xl space-y-8 px-4">
        <BudgetHeader />

        <div className="space-y-6 rounded-2xl bg-white p-6 shadow-lg">
          <PriceSlider value={budget} onChange={setBudget} />
        </div>

        <div className="space-y-6 rounded-2xl bg-white p-6 shadow-lg">
          <CategorySelector
            budget={budget}
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        <button
          onClick={handleGenerateRecipe}
          disabled={!selectedCategory}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-olive-light to-olive-medium px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg"
        >
          <ChefHat className="h-6 w-6" />
          <span>레시피 추천받기</span>
        </button>
      </div>
    </div>
  );
};

export default BudgetRecipe;
