"use client";

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
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">
          어떤 음식이 땡기시나요?
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          선호하는 음식 종류를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onChange(category.value)}
            className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all ${
              selectedCategory === category.value
                ? "border-olive-light bg-olive-light text-white shadow-md"
                : "border-gray-200 bg-white text-gray-700 hover:border-olive-light hover:bg-olive-light/10"
            }`}
          >
            <span className="text-2xl">{category.emoji}</span>
            <span className="font-medium">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
