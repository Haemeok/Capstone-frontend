"use client";

import { motion } from "framer-motion";
import { ChevronRight, Plus } from "lucide-react";

import { convertIngredientQuantity } from "@/shared/lib/ingredientConversion";

import type { Recipe, StaticRecipe } from "@/entities/recipe/model/types";

import type { SheetComponents } from "./sheet-components";

type ReportListViewProps = SheetComponents & {
  recipe: Recipe | StaticRecipe;
  servingRatio: number;
  onIngredientSelect: (name: string) => void;
  onMissingSelect: () => void;
};

export const ReportListView = ({
  recipe,
  servingRatio,
  onIngredientSelect,
  onMissingSelect,
  Header,
  Title,
  Description,
}: ReportListViewProps) => (
  <motion.div
    key="list"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex max-h-[70vh] flex-col"
  >
    <Header>
      <Title className="text-ink text-xl font-bold">재료 오류 제보</Title>
      <Description className="text-ink-muted mt-1 text-sm">
        문제가 있는 재료를 선택해주세요
      </Description>
    </Header>

    <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-2 pb-6">
      <button
        type="button"
        onClick={onMissingSelect}
        className="hover:border-olive-light hover:bg-olive-light/5 mb-3 flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-left transition-all"
      >
        <Plus className="h-4 w-4 text-gray-400" />
        <span className="text-ink-muted text-sm font-medium">
          빠진 재료가 있나요?
        </span>
      </button>

      <div className="space-y-1.5">
        {recipe.ingredients.map((ingredient, index) => {
          const converted = convertIngredientQuantity(
            ingredient.quantity,
            ingredient.unit,
            servingRatio
          );
          const amount =
            converted.quantity !== "약간"
              ? `${converted.quantity}${converted.unit}`
              : "약간";

          return (
            <button
              key={index}
              type="button"
              onClick={() => onIngredientSelect(ingredient.name)}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-left transition-all hover:border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-ink font-medium">{ingredient.name}</span>
                <span className="text-sm text-gray-400">{amount}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </button>
          );
        })}
      </div>
    </div>
  </motion.div>
);
