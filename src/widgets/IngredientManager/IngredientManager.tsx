import { Plus, X } from "lucide-react";

type IngredientManagerProps = {
  ingredients: string[];
  onRemoveIngredient: (index: number) => void;
  onOpenDrawer: () => void;
  onRemoveAllIngredients: () => void;
};

const IngredientManager = ({
  ingredients,
  onRemoveIngredient,
  onOpenDrawer,
  onRemoveAllIngredients,
}: IngredientManagerProps) => {
  return (
    <div className="mb-6">
      <div
        className="hover:bg-olive-mint/80 border-olive-mint flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed bg-[#f7f7f7] p-5 transition-all duration-300"
        onClick={onOpenDrawer}
      >
        <div className="flex flex-col items-center">
          <div className="mb-2 rounded-full bg-white p-3 shadow-md">
            <Plus size={24} className="text-olive-mint" />
          </div>
          <span className="text-olive-mint font-medium">재료 추가하기</span>
          <span className="mt-1 text-sm text-gray-500">
            {ingredients.length > 0
              ? `${ingredients.length}개의 재료가 추가됨`
              : "레시피 생성을 위해 재료를 추가해주세요"}
          </span>
        </div>
      </div>

      {ingredients.length > 0 && (
        <div className="bg-olive-mint/10 mt-4 rounded-lg p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-olive-mint text-sm font-medium">선택된 재료</h3>
            {ingredients.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveAllIngredients();
                }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveIngredient(index);
                  }}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-100 opacity-70 transition-all group-hover:opacity-100 hover:bg-red-100 hover:text-red-500"
                  aria-label={`${ingredient} 삭제`}
                >
                  <X size={14} />
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
