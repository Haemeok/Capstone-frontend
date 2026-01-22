import { useFormContext, useWatch } from "react-hook-form";

import { INGREDIENT_BLACK_IMAGE_URL } from "@/shared/config/constants/recipe";
import { SearchIcon, XIcon } from "@/shared/ui/icons";
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

      <div className="space-y-2">
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="재료 검색하기"
          className="group relative flex w-full cursor-pointer items-center border-b-2 border-gray-300 pb-3 transition-colors hover:border-gray-900"
        >
          <SearchIcon
            size={20}
            className="mr-3 text-gray-400 transition-colors group-hover:text-gray-900"
          />
          <span className="text-base text-gray-500 group-hover:text-gray-900">
            재료를 검색하세요...
          </span>
        </button>
        {ingredients.length > 0 && (
          <p className="text-sm text-gray-600">
            {ingredients.length}개의 재료가 추가됨
          </p>
        )}
      </div>

      {ingredients.length > 0 && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">선택된 재료</h3>
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
                      src={INGREDIENT_BLACK_IMAGE_URL(ingredient.name)}
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
                    <XIcon size={10} />
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
