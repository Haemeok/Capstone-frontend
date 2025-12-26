import { useFormContext, useWatch } from "react-hook-form";
import { Plus, X } from "lucide-react";

import { INGREDIENT_IMAGE_URL } from "@/shared/config/constants/recipe";
import { Image } from "@/shared/ui/image/Image";

type FineDiningIngredientManagerProps = {
  onOpenDrawer: () => void;
};

type IngredientItem = {
  id: number;
  name: string;
};

const FineDiningIngredientManager = ({
  onOpenDrawer,
}: FineDiningIngredientManagerProps) => {
  const { control, setValue } = useFormContext<{
    ingredients: IngredientItem[];
  }>();

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
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-2xl font-bold text-gray-900">재료 선택</h3>
        <p className="text-sm text-gray-600">
          사용할 재료를 선택해주세요 (최소 3개)
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="재료 추가하기"
        className="flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-all duration-300 hover:border-gray-400 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center">
          <div className="mb-3 rounded-full bg-white p-3 shadow-md">
            <Plus size={24} className="text-gray-700" aria-hidden="true" />
          </div>
          <span className="font-medium text-gray-900">재료 추가하기</span>
          <span className="mt-1 text-sm text-gray-500">
            {ingredients.length > 0
              ? `${ingredients.length}개의 재료가 추가됨`
              : "레시피 생성을 위해 재료를 추가해주세요"}
          </span>
        </div>
      </button>

      {ingredients.length > 0 && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              선택된 재료
            </h3>
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAllIngredients();
                }}
                aria-label="모든 재료 삭제"
                className="cursor-pointer px-2 py-1 text-xs text-gray-500 hover:text-gray-900"
              >
                전체 삭제
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-x-1 gap-y-4 min-[375px]:grid-cols-4 sm:grid-cols-5 md:grid-cols-6">
            {ingredients.map((ingredient, index) => (
              <div
                key={ingredient.id || ingredient.name}
                className="group relative flex flex-col items-center gap-1.5"
              >
                <div className="relative">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm">
                    <Image
                      src={INGREDIENT_IMAGE_URL(ingredient.name)}
                      alt={ingredient.name}
                      wrapperClassName="h-full w-full"
                      fit="cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveIngredient(index);
                    }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow-sm transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    aria-label={`${ingredient.name} 삭제`}
                  >
                    <X size={10} strokeWidth={3} aria-hidden="true" />
                  </button>
                </div>
                <span className="w-full truncate text-center text-xs font-medium text-gray-700">
                  {ingredient.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FineDiningIngredientManager;
