import { useFormContext, useWatch } from "react-hook-form";

import { Plus, X } from "lucide-react";

import type { AIRecipeFormValues } from "@/features/recipe-create-ai/model/schema";

type IngredientManagerProps = {
  onOpenDrawer: () => void;
};

const IngredientManager = ({ onOpenDrawer }: IngredientManagerProps) => {
  const { control, setValue } = useFormContext<AIRecipeFormValues>();

  const ingredients = useWatch({
    control,
    name: "ingredients",
    defaultValue: [],
  });

  const handleRemoveAllIngredients = () => {
    setValue("ingredients", [], { shouldDirty: true });
  };

  const handleRemoveIngredient = (index: number) => {
    const next = ingredients.filter((_, i) => i !== index);
    setValue("ingredients", next, { shouldDirty: true });
  };

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="재료 추가하기"
        className="hover:bg-olive-mint/80 border-olive-mint flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed bg-[#f7f7f7] p-5 transition-all duration-300"
      >
        <div className="flex flex-col items-center">
          <div className="mb-2 rounded-full bg-white p-3 shadow-md">
            <Plus size={24} className="text-olive-mint" aria-hidden="true" />
          </div>
          <span className="text-olive-mint font-medium">재료 추가하기</span>
          <span className="mt-1 text-sm text-gray-500">
            {ingredients.length > 0
              ? `${ingredients.length}개의 재료가 추가됨`
              : "레시피 생성을 위해 재료를 추가해주세요"}
          </span>
        </div>
      </button>

      {ingredients.length > 0 && (
        <div className="bg-olive-mint/10 mt-4 rounded-lg p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-olive-mint text-sm font-medium">선택된 재료</h3>
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAllIngredients();
                }}
                aria-label="모든 재료 삭제"
                className="cursor-pointer px-2 py-1 text-xs text-red-600 hover:text-red-800"
              >
                전체 삭제
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="group flex items-center justify-between gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm shadow-sm"
              >
                <span>{ingredient}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveIngredient(index);
                  }}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-100 opacity-70 transition-all group-hover:opacity-100 hover:bg-red-100 hover:text-red-500"
                  aria-label={`${ingredient} 삭제`}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientManager;
