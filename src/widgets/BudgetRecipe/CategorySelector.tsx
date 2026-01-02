"use client";

import { Check } from "lucide-react";
import { getCategoriesForBudget } from "@/shared/config/constants/budget";

type CategorySelectorProps = {
  budget: number;
  selectedCategory: string | null;
  onChange: (category: string) => void;
};

const CategorySelector = ({
  budget,
  selectedCategory,
  onChange,
}: CategorySelectorProps) => {
  const categories = getCategoriesForBudget(budget);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">
          어떤 음식이 땡기시나요?
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          선호하는 음식 종류를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.value;

          return (
            <button
              key={category.id}
              onClick={() => onChange(category.value)}
              className={`relative flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 transition-all active:scale-95 ${
                isSelected
                  ? "border-olive-light bg-olive-light/10 shadow-md"
                  : "hover:border-olive-light border-gray-200 bg-white hover:scale-[1.02] hover:shadow-sm"
              }`}
            >
              {isSelected && (
                <div className="bg-olive-light absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </div>
              )}

              <span className="text-3xl">{category.emoji}</span>
              <span
                className={`text-center text-sm font-semibold ${
                  isSelected ? "text-olive-light" : "text-gray-700"
                }`}
              >
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
