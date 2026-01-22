"use client";

import { cn } from "@/shared/lib/utils";

import { IngredientReportReason } from "@/entities/recipe/model/api";

type ReportCategory = {
  value: IngredientReportReason;
  label: string;
  description: string;
};

type ReportCategoryButtonProps = {
  category: ReportCategory;
  isSelected: boolean;
  onSelect: () => void;
};

export const ReportCategoryButton = ({
  category,
  isSelected,
  onSelect,
}: ReportCategoryButtonProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full cursor-pointer rounded-2xl border-2 p-4 text-left transition-all",
        isSelected
          ? "border-olive-light bg-olive-light/5 ring-2 ring-olive-light/20"
          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
      )}
    >
      <p
        className={cn(
          "font-medium",
          isSelected ? "text-olive-light" : "text-gray-900"
        )}
      >
        {category.label}
      </p>
      <p className="mt-0.5 text-sm text-gray-500">{category.description}</p>
    </button>
  );
};

export type { ReportCategory };
