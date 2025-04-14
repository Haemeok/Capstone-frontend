import { Plus, X } from "lucide-react";

type IngredientSectionProps = {
  ingredients: string[];
  onRemoveIngredient: (index: number) => void;
  onOpenDrawer: () => void;
  onRemoveAllIngredients: () => void;
};

const IngredientSection = ({
  ingredients,
  onRemoveIngredient,
  onOpenDrawer,
  onRemoveAllIngredients,
}: IngredientSectionProps) => {
  return (
    <div className="mb-6">
      <div
        className="flex items-center justify-center bg-[#f7f7f7] p-5 rounded-xl cursor-pointer hover:bg-olive-light/80 transition-all duration-300 border-2 border-dashed border-olive-light"
        onClick={onOpenDrawer}
      >
        <div className="flex flex-col items-center">
          <div className="bg-white p-3 rounded-full mb-2 shadow-md">
            <Plus size={24} className="text-olive-light" />
          </div>
          <span className="font-medium text-olive-light">재료 추가하기</span>
          <span className="text-sm text-gray-500 mt-1">
            {ingredients.length > 0
              ? `${ingredients.length}개의 재료가 추가됨`
              : "레시피 생성을 위해 재료를 추가해주세요"}
          </span>
        </div>
      </div>

      {ingredients.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-green-800">선택된 재료</h3>
            {ingredients.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveAllIngredients();
                }}
                className="text-xs text-red-600 hover:text-red-800 cursor-pointer px-2 py-1"
              >
                전체 삭제
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="group flex items-center justify-between gap-2 bg-white px-4 py-2 rounded-full text-sm shadow-sm border border-green-200"
              >
                <span>{ingredient}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveIngredient(index);
                  }}
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 opacity-70 group-hover:opacity-100 hover:text-red-500 transition-all cursor-pointer"
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

export default IngredientSection;
